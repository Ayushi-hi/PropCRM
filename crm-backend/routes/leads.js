const express = require('express');
const router = express.Router();
const {
  createLead, getLeads, getLeadById,
  updateLead, deleteLead, assignLead, updateLeadStatus,
} = require('../controllers/leadController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { leadValidation, validate } = require('../utils/validators');

router.use(protect);

router.route('/')
  .get(getLeads)
  .post(leadValidation, validate, createLead);

router.route('/:id')
  .get(getLeadById)
  .put(updateLead)
  .delete(authorize('admin', 'manager'), deleteLead);

router.patch('/:id/assign', authorize('admin', 'manager'), assignLead);
router.patch('/:id/status', updateLeadStatus);

module.exports = router;