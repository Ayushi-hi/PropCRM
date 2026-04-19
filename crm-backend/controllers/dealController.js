const Deal = require('../models/Deal');
const Activity = require('../models/Activity');
const { notifyDealClosed } = require('../services/notificationService');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');

const VALID_STAGES = ['Qualification', 'Proposal', 'Site Visit', 'Negotiation', 'Agreement', 'Closed', 'Lost'];

// @desc  Create deal
// @route POST /api/deals
const createDeal = async (req, res, next) => {
  try {
    const deal = await Deal.create({ ...req.body, assignedAgent: req.user._id });

    await Activity.create({
      entityType: 'deal',
      entityId: deal._id,
      action: 'DEAL_CREATED',
      description: `Deal created. Value: ₹${deal.dealValue}`,
      performedBy: req.user._id,
    });

    return successResponse(res, deal, 'Deal created', 201);
  } catch (error) {
    next(error);
  }
};

// @desc  Get all deals
// @route GET /api/deals
const getDeals = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, stage, status } = req.query;
    const filter = {};

    if (req.user.role === 'agent') filter.assignedAgent = req.user._id;
    if (stage) filter.stage = stage;
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const [deals, total] = await Promise.all([
      Deal.find(filter)
        .populate('client', 'name email phone')
        .populate('property', 'title location.address price')
        .populate('assignedAgent', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Deal.countDocuments(filter),
    ]);

    return paginatedResponse(res, deals, total, page, limit, 'Deals fetched');
  } catch (error) {
    next(error);
  }
};

// @desc  Update deal stage
// @route PATCH /api/deals/:id/stage
const updateDealStage = async (req, res, next) => {
  try {
    const { stage, note } = req.body;

    if (!VALID_STAGES.includes(stage)) {
      return errorResponse(res, `Stage must be one of: ${VALID_STAGES.join(', ')}`, 400);
    }

    const deal = await Deal.findById(req.params.id);
    if (!deal) return errorResponse(res, 'Deal not found', 404);

    const prevStage = deal.stage;
    deal.stage = stage;

    if (stage === 'Closed') {
      deal.status = 'closed';
      deal.closedAt = new Date();
    } else if (stage === 'Lost') {
      deal.status = 'lost';
    }

    deal.stageHistory.push({ stage, changedBy: req.user._id, note });
    await deal.save();

    await Activity.create({
      entityType: 'deal',
      entityId: deal._id,
      action: 'STAGE_UPDATED',
      description: `Deal stage: ${prevStage} → ${stage}`,
      performedBy: req.user._id,
      metadata: { prevStage, newStage: stage },
    });

    // Notify on closure
    if (stage === 'Closed' && deal.assignedAgent) {
      await deal.populate('assignedAgent');
      await notifyDealClosed(deal.assignedAgent, deal);
    }

    return successResponse(res, deal, `Deal moved to ${stage}`);
  } catch (error) {
    next(error);
  }
};

module.exports = { createDeal, getDeals, updateDealStage };