const express = require('express');
const router = express.Router();
const { createDeal, getDeals, updateDealStage } = require('../controllers/dealController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { dealValidation, validate } = require('../utils/validators');

router.use(protect);

router.route('/').get(getDeals).post(dealValidation, validate, createDeal);
router.patch('/:id/stage', updateDealStage);

module.exports = router;