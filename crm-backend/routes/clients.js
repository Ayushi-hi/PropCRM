const express = require('express');
const router = express.Router();
const { createClient, getClients, addInteraction } = require('../controllers/clientController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getClients).post(createClient);
router.post('/:id/interaction', addInteraction);

module.exports = router;