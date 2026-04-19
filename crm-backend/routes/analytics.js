const express = require('express');
const router = express.Router();
const { getOverview, getAgentReport, getCommissionReport, getLeadFunnel } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

router.use(protect);
router.get('/overview', getOverview);
router.get('/agents', authorize('admin', 'manager'), getAgentReport);
router.get('/commission', authorize('admin', 'manager'), getCommissionReport);
router.get('/funnel', getLeadFunnel);

module.exports = router;