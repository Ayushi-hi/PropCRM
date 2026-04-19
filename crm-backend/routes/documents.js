const express = require('express');
const router = express.Router();
const { uploadDocument, getDocuments, deleteDocument } = require('../controllers/documentController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

router.use(protect);
router.route('/').get(getDocuments).post(uploadDocument);
router.delete('/:id', authorize('admin', 'manager'), deleteDocument);

module.exports = router;