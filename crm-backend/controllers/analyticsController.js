const Lead = require('../models/Lead');
const Deal = require('../models/Deal');
const Client = require('../models/Client');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { successResponse } = require('../utils/apiResponse');

// @desc  Overview analytics
// @route GET /api/analytics/overview
const getOverview = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const last6Months = new Date(new Date().setMonth(new Date().getMonth() - 6));

    const agentFilter = req.user.role === 'agent' ? { assignedAgent: req.user._id } : {};

    const [
      totalLeads, newLeadsThisMonth, hotLeads,
      closedDeals, activeDeals, totalClients,
      totalRevenue, agentPerformance,
      monthlyLeads, leadsBySource, leadsByStatus,
    ] = await Promise.all([
      Lead.countDocuments(agentFilter),
      Lead.countDocuments({ ...agentFilter, createdAt: { $gte: startOfMonth } }),
      Lead.countDocuments({ ...agentFilter, score: { $gte: 70 } }),
      Deal.countDocuments({ ...agentFilter, stage: 'Closed' }),
      Deal.countDocuments({ ...agentFilter, status: 'active' }),
      Client.countDocuments(agentFilter),

      Deal.aggregate([
        { $match: { stage: 'Closed' } },
        { $group: { _id: null, total: { $sum: '$dealValue' }, commission: { $sum: '$commission' } } },
      ]),

      req.user.role !== 'agent' ? User.aggregate([
        { $match: { role: 'agent', isActive: true } },
        { $lookup: { from: 'leads', localField: '_id', foreignField: 'assignedAgent', as: 'leads' } },
        { $lookup: { from: 'deals', localField: '_id', foreignField: 'assignedAgent', as: 'deals' } },
        {
          $project: {
            name: 1, email: 1,
            totalLeads: { $size: '$leads' },
            closedDeals: { $size: { $filter: { input: '$deals', as: 'd', cond: { $eq: ['$$d.stage', 'Closed'] } } } },
            conversionRate: {
              $cond: [
                { $gt: [{ $size: '$leads' }, 0] },
                { $multiply: [{ $divide: [{ $size: { $filter: { input: '$deals', as: 'd', cond: { $eq: ['$$d.stage', 'Closed'] } } } }, { $size: '$leads' }] }, 100] },
                0,
              ]
            },
          }
        }
      ]) : [],

      Lead.aggregate([
        { $match: { createdAt: { $gte: last6Months }, ...agentFilter } },
        { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),

      Lead.aggregate([
        { $match: agentFilter },
        { $group: { _id: '$source', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      Lead.aggregate([
        { $match: agentFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    const revenueData = totalRevenue[0] || { total: 0, commission: 0 };
    const conversionRate = totalLeads > 0 ? ((closedDeals / totalLeads) * 100).toFixed(1) : 0;

    return successResponse(res, {
      summary: {
        totalLeads, newLeadsThisMonth, hotLeads,
        closedDeals, activeDeals, totalClients,
        conversionRate: `${conversionRate}%`,
        totalRevenue: revenueData.total,
        totalCommission: revenueData.commission,
      },
      agentPerformance,
      monthlyLeads,
      leadsBySource,
      leadsByStatus,
    }, 'Analytics fetched');
  } catch (error) { next(error); }
};

// @desc  Agent-wise detailed report
// @route GET /api/analytics/agents
const getAgentReport = async (req, res, next) => {
  try {
    const report = await User.aggregate([
      { $match: { role: 'agent', isActive: true } },
      { $lookup: { from: 'leads', localField: '_id', foreignField: 'assignedAgent', as: 'leads' } },
      { $lookup: { from: 'deals', localField: '_id', foreignField: 'assignedAgent', as: 'deals' } },
      { $lookup: { from: 'followups', localField: '_id', foreignField: 'assignedAgent', as: 'followups' } },
      {
        $project: {
          name: 1, email: 1, phone: 1,
          totalLeads: { $size: '$leads' },
          hotLeads: { $size: { $filter: { input: '$leads', as: 'l', cond: { $gte: ['$$l.score', 70] } } } },
          closedDeals: { $size: { $filter: { input: '$deals', as: 'd', cond: { $eq: ['$$d.stage', 'Closed'] } } } },
          activeDeals: { $size: { $filter: { input: '$deals', as: 'd', cond: { $eq: ['$$d.status', 'active'] } } } },
          pendingFollowups: { $size: { $filter: { input: '$followups', as: 'f', cond: { $eq: ['$$f.status', 'Pending'] } } } },
          conversionRate: {
            $cond: [
              { $gt: [{ $size: '$leads' }, 0] },
              { $multiply: [{ $divide: [{ $size: { $filter: { input: '$deals', as: 'd', cond: { $eq: ['$$d.stage', 'Closed'] } } } }, { $size: '$leads' }] }, 100] },
              0,
            ]
          },
        }
      },
      { $sort: { closedDeals: -1 } },
    ]);

    return successResponse(res, report, 'Agent report fetched');
  } catch (error) { next(error); }
};

// @desc  Commission report
// @route GET /api/analytics/commission
const getCommissionReport = async (req, res, next) => {
  try {
    const report = await Deal.aggregate([
      { $match: { stage: 'Closed' } },
      { $lookup: { from: 'users', localField: 'assignedAgent', foreignField: '_id', as: 'agent' } },
      { $unwind: { path: '$agent', preserveNullAndEmpty: true } },
      {
        $group: {
          _id: '$assignedAgent',
          agentName: { $first: '$agent.name' },
          agentEmail: { $first: '$agent.email' },
          totalDeals: { $sum: 1 },
          totalRevenue: { $sum: '$dealValue' },
          totalCommission: { $sum: '$commission' },
          avgDealValue: { $avg: '$dealValue' },
        }
      },
      { $sort: { totalCommission: -1 } },
    ]);

    const overall = await Deal.aggregate([
      { $match: { stage: 'Closed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$dealValue' }, totalCommission: { $sum: '$commission' }, totalDeals: { $sum: 1 } } },
    ]);

    return successResponse(res, {
      byAgent: report,
      overall: overall[0] || { totalRevenue: 0, totalCommission: 0, totalDeals: 0 },
    }, 'Commission report fetched');
  } catch (error) { next(error); }
};

// @desc  Lead funnel by status
// @route GET /api/analytics/funnel
const getLeadFunnel = async (req, res, next) => {
  try {
    const agentFilter = req.user.role === 'agent' ? { assignedAgent: req.user._id } : {};
    const funnel = await Lead.aggregate([
      { $match: agentFilter },
      { $group: { _id: '$status', count: { $sum: 1 }, avgScore: { $avg: '$score' } } },
      { $sort: { count: -1 } },
    ]);
    return successResponse(res, funnel, 'Lead funnel fetched');
  } catch (error) { next(error); }
};

module.exports = { getOverview, getAgentReport, getCommissionReport, getLeadFunnel };