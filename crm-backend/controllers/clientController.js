const Client = require('../models/Client');
const Lead = require('../models/Lead');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');

// @desc  Convert lead to client OR create client directly
// @route POST /api/clients
const createClient = async (req, res, next) => {
  try {
    const { leadId, ...rest } = req.body;

    let clientData = { ...rest, assignedAgent: req.user._id };

    if (leadId) {
      const lead = await Lead.findById(leadId);
      if (!lead) return errorResponse(res, 'Lead not found', 404);

      clientData = {
        lead: leadId,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        assignedAgent: lead.assignedAgent || req.user._id,
        preferences: lead.preferences,
        ...rest,
      };

      // Mark lead as converted
      lead.isConverted = true;
      lead.convertedAt = new Date();
      lead.status = 'Closed';
      await lead.save();
    }

    const client = await Client.create(clientData);
    return successResponse(res, client, 'Client created', 201);
  } catch (error) {
    next(error);
  }
};

// @desc  Get all clients
// @route GET /api/clients
const getClients = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const filter = {};

    if (req.user.role === 'agent') filter.assignedAgent = req.user._id;
    if (status) filter.status = status;
    if (search) filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];

    const skip = (page - 1) * limit;
    const [clients, total] = await Promise.all([
      Client.find(filter)
        .populate('assignedAgent', 'name email')
        .populate('lead', 'name status score')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Client.countDocuments(filter),
    ]);

    return paginatedResponse(res, clients, total, page, limit, 'Clients fetched');
  } catch (error) {
    next(error);
  }
};

// @desc  Add interaction to client
// @route POST /api/clients/:id/interaction
const addInteraction = async (req, res, next) => {
  try {
    const { type, note } = req.body;
    const client = await Client.findById(req.params.id);
    if (!client) return errorResponse(res, 'Client not found', 404);

    client.interactionHistory.push({ type, note, performedBy: req.user._id });
    await client.save();

    return successResponse(res, client, 'Interaction logged');
  } catch (error) {
    next(error);
  }
};

module.exports = { createClient, getClients, addInteraction };