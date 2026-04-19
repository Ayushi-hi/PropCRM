const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const Activity = require('../models/Activity');
const { calculateLeadScore, getNextBestAction } = require('../services/leadScoringService');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const crypto = require('crypto');

/**
 * PUBLIC webhook endpoint — no JWT required.
 * Used for:
 *   - Website contact forms
 *   - n8n workflows (lead capture automation)
 *   - Third-party property portals
 *
 * Validate using a shared WEBHOOK_SECRET in the request header.
 */

const verifyWebhookSecret = (req, res, next) => {
  const secret = req.headers['x-webhook-secret'];
  if (!secret || secret !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ success: false, message: 'Invalid webhook secret' });
  }
  next();
};

// @route POST /api/webhooks/lead
// @desc  Receive lead from n8n / website form / external portal
router.post('/lead', verifyWebhookSecret, async (req, res, next) => {
  try {
    const { name, phone, email, source, budget, preferences, notes } = req.body;

    if (!name) {
      return errorResponse(res, 'Lead name is required', 400);
    }

    const leadData = {
      name: name?.trim(),
      phone: phone?.trim(),
      email: email?.toLowerCase()?.trim(),
      source: source || 'website',
      budget: budget ? Number(budget) : undefined,
      preferences,
      notes,
      status: 'New',
    };

    leadData.score = calculateLeadScore(leadData);
    leadData.nextAction = getNextBestAction({ ...leadData, visitedProperties: [] });

    const lead = await Lead.create(leadData);

    await Activity.create({
      entityType: 'lead',
      entityId: lead._id,
      action: 'LEAD_CREATED',
      description: `Lead captured via webhook (${source || 'website'})`,
      metadata: { source: source || 'website', ip: req.ip },
    });

    // Trigger n8n back (optional notify flow)
    // await axios.post(process.env.N8N_NOTIFY_URL, { leadId: lead._id, name: lead.name })

    return successResponse(res, {
      leadId: lead._id,
      name: lead.name,
      score: lead.score,
      nextAction: lead.nextAction,
    }, 'Lead captured successfully', 201);
  } catch (error) {
    next(error);
  }
});

// @route POST /api/webhooks/n8n
// @desc  Generic n8n automation webhook — handles various event types
router.post('/n8n', verifyWebhookSecret, async (req, res, next) => {
  try {
    const { event, data } = req.body;

    switch (event) {
      case 'LEAD_FROM_FORM':
        // Website contact form via n8n
        const lead = await Lead.create({
          ...data,
          source: data.source || 'website',
          status: 'New',
          score: calculateLeadScore(data),
          nextAction: getNextBestAction({ ...data, visitedProperties: [] }),
        });
        return successResponse(res, { leadId: lead._id }, 'Lead created from n8n');

      case 'LEAD_STATUS_UPDATE':
        await Lead.findByIdAndUpdate(data.leadId, { status: data.status });
        return successResponse(res, null, 'Lead status updated via n8n');

      case 'PING':
        return successResponse(res, { pong: true, timestamp: new Date() }, 'Webhook alive');

      default:
        return errorResponse(res, `Unknown event type: ${event}`, 400);
    }
  } catch (error) {
    next(error);
  }
});

// @route GET /api/webhooks/test
// @desc  Test webhook is working (for n8n setup)
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'PropCRM Webhook endpoint is live',
    timestamp: new Date(),
    endpoints: {
      leadCapture: 'POST /api/webhooks/lead',
      n8nGeneric: 'POST /api/webhooks/n8n',
    },
    headers_required: {
      'x-webhook-secret': 'Your WEBHOOK_SECRET from .env',
      'Content-Type': 'application/json',
    },
  });
});

module.exports = router;