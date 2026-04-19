const express = require('express');
const router = express.Router();
const { createFollowUp, getFollowUps, updateFollowUp } = require('../controllers/followUpController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getFollowUps).post(createFollowUp);
router.patch('/:id', updateFollowUp);

module.exports = router;