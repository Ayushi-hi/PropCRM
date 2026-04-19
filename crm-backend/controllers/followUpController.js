const FollowUp = require('../models/FollowUp');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');

// @desc  Create follow-up
// @route POST /api/followups
const createFollowUp = async (req, res, next) => {
  try {
    const followUp = await FollowUp.create({
      ...req.body,
      assignedAgent: req.body.assignedAgent || req.user._id,
    });
    return successResponse(res, followUp, 'Follow-up scheduled', 201);
  } catch (error) {
    next(error);
  }
};

// @desc  Get follow-ups
// @route GET /api/followups
const getFollowUps = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, priority, upcoming } = req.query;
    const filter = {};

    if (req.user.role === 'agent') filter.assignedAgent = req.user._id;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    // Get only upcoming (within next 7 days)
    if (upcoming === 'true') {
      filter.scheduledAt = {
        $gte: new Date(),
        $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };
      filter.status = 'Pending';
    }

    const skip = (page - 1) * limit;
    const [followUps, total] = await Promise.all([
      FollowUp.find(filter)
        .populate('lead', 'name phone status score')
        .populate('client', 'name phone')
        .populate('assignedAgent', 'name email')
        .sort({ scheduledAt: 1 })
        .skip(skip)
        .limit(Number(limit)),
      FollowUp.countDocuments(filter),
    ]);

    return paginatedResponse(res, followUps, total, page, limit, 'Follow-ups fetched');
  } catch (error) {
    next(error);
  }
};

// @desc  Update follow-up status
// @route PATCH /api/followups/:id
const updateFollowUp = async (req, res, next) => {
  try {
    const { status, outcome } = req.body;
    const update = { status };

    if (status === 'Completed') {
      update.completedAt = new Date();
      update.outcome = outcome;
    }

    const followUp = await FollowUp.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!followUp) return errorResponse(res, 'Follow-up not found', 404);

    return successResponse(res, followUp, 'Follow-up updated');
  } catch (error) {
    next(error);
  }
};

module.exports = { createFollowUp, getFollowUps, updateFollowUp };