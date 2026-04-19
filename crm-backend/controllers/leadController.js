const Lead = require('../models/Lead');
const Activity = require('../models/Activity');
const User = require('../models/User');
const { calculateLeadScore, getNextBestAction } = require('../services/leadScoringService');
const { notifyLeadAssigned } = require('../services/notificationService');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');

// @desc  Create lead
// @route POST /api/leads
const createLead = async (req, res, next) => {
  try {
    const leadData = { ...req.body };
    const score = calculateLeadScore(leadData);
    const nextAction = getNextBestAction({ ...leadData, score, visitedProperties: [] });

    const lead = await Lead.create({ ...leadData, score, nextAction });

    // Log activity
    await Activity.create({
      entityType: 'lead',
      entityId: lead._id,
      action: 'LEAD_CREATED',
      description: `Lead "${lead.name}" created`,
      performedBy: req.user._id,
    });

    return successResponse(res, lead, 'Lead created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// @desc  Get all leads
// @route GET /api/leads
const getLeads = async (req, res, next) => {
  try {
    const {
      page = 1, limit = 20, status, source, assignedAgent,
      search, minScore, maxScore, sortBy = 'createdAt', sortOrder = 'desc',
    } = req.query;

    const filter = {};

    // Agents can only see their own leads
    if (req.user.role === 'agent') {
      filter.assignedAgent = req.user._id;
    } else if (assignedAgent) {
      filter.assignedAgent = assignedAgent;
    }

    if (status) filter.status = status;
    if (source) filter.source = source;

    if (minScore || maxScore) {
      filter.score = {};
      if (minScore) filter.score.$gte = Number(minScore);
      if (maxScore) filter.score.$lte = Number(maxScore);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const skip = (page - 1) * limit;

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .populate('assignedAgent', 'name email role')
        .populate('interestedProperties', 'title location.address price')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Lead.countDocuments(filter),
    ]);

    return paginatedResponse(res, leads, total, page, limit, 'Leads fetched');
  } catch (error) {
    next(error);
  }
};

// @desc  Get single lead
// @route GET /api/leads/:id
const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('assignedAgent', 'name email phone role')
      .populate('interestedProperties')
      .populate('visitedProperties')
      .populate('timeline.performedBy', 'name');

    if (!lead) return errorResponse(res, 'Lead not found', 404);

    // Agent can only view their own leads
    if (req.user.role === 'agent' && String(lead.assignedAgent?._id) !== String(req.user._id)) {
      return errorResponse(res, 'Not authorized to view this lead', 403);
    }

    return successResponse(res, lead, 'Lead fetched');
  } catch (error) {
    next(error);
  }
};

// @desc  Update lead
// @route PUT /api/leads/:id
const updateLead = async (req, res, next) => {
  try {
    let lead = await Lead.findById(req.params.id);
    if (!lead) return errorResponse(res, 'Lead not found', 404);

    // Merge updates
    Object.assign(lead, req.body);

    // Recalculate score + next action
    lead.score = calculateLeadScore(lead);
    lead.nextAction = getNextBestAction(lead);

    // Track in timeline
    lead.timeline.push({
      action: 'LEAD_UPDATED',
      note: req.body.notes || 'Lead details updated',
      performedBy: req.user._id,
    });

    await lead.save();

    await Activity.create({
      entityType: 'lead',
      entityId: lead._id,
      action: 'LEAD_UPDATED',
      description: `Lead "${lead.name}" updated`,
      performedBy: req.user._id,
    });

    return successResponse(res, lead, 'Lead updated');
  } catch (error) {
    next(error);
  }
};

// @desc  Delete lead
// @route DELETE /api/leads/:id
const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return errorResponse(res, 'Lead not found', 404);

    await lead.deleteOne();

    await Activity.create({
      entityType: 'lead',
      entityId: lead._id,
      action: 'LEAD_DELETED',
      description: `Lead "${lead.name}" deleted`,
      performedBy: req.user._id,
    });

    return successResponse(res, null, 'Lead deleted successfully');
  } catch (error) {
    next(error);
  }
};

// @desc  Assign lead to agent
// @route PATCH /api/leads/:id/assign
const assignLead = async (req, res, next) => {
  try {
    const { agentId } = req.body;
    if (!agentId) return errorResponse(res, 'agentId is required', 400);

    const agent = await User.findById(agentId);
    if (!agent || agent.role !== 'agent') return errorResponse(res, 'Agent not found', 404);

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        assignedAgent: agentId,
        $push: {
          timeline: {
            action: 'LEAD_ASSIGNED',
            note: `Assigned to ${agent.name}`,
            performedBy: req.user._id,
          },
        },
      },
      { new: true }
    ).populate('assignedAgent', 'name email');

    if (!lead) return errorResponse(res, 'Lead not found', 404);

    // Notify agent
    await notifyLeadAssigned(agent, lead);

    return successResponse(res, lead, `Lead assigned to ${agent.name}`);
  } catch (error) {
    next(error);
  }
};

// @desc  Update lead status
// @route PATCH /api/leads/:id/status
const updateLeadStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['New', 'Contacted', 'Qualified', 'Closed', 'Lost'];
    if (!validStatuses.includes(status)) {
      return errorResponse(res, `Status must be one of: ${validStatuses.join(', ')}`, 400);
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) return errorResponse(res, 'Lead not found', 404);

    const prevStatus = lead.status;
    lead.status = status;
    lead.interactionCount += 1;
    lead.lastContacted = new Date();

    // Recalculate
    lead.score = calculateLeadScore(lead);
    lead.nextAction = getNextBestAction(lead);

    lead.timeline.push({
      action: 'STATUS_CHANGED',
      note: `Status changed from ${prevStatus} to ${status}`,
      performedBy: req.user._id,
    });

    await lead.save();

    await Activity.create({
      entityType: 'lead',
      entityId: lead._id,
      action: 'STATUS_CHANGED',
      description: `Lead status: ${prevStatus} → ${status}`,
      performedBy: req.user._id,
      metadata: { prevStatus, newStatus: status },
    });

    return successResponse(res, lead, `Lead status updated to ${status}`);
  } catch (error) {
    next(error);
  }
};

module.exports = { createLead, getLeads, getLeadById, updateLead, deleteLead, assignLead, updateLeadStatus };