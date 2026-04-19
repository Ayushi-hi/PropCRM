const express = require('express');
const router = express.Router();
const {
  createProperty, getProperties, getPropertyById, updateProperty, deleteProperty,
} = require('../controllers/propertyController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { propertyValidation, validate } = require('../utils/validators');

router.use(protect);

router.route('/')
  .get(getProperties)
  .post(authorize('admin', 'manager'), propertyValidation, validate, createProperty);

router.route('/:id')
  .get(getPropertyById)
  .put(authorize('admin', 'manager'), updateProperty)
  .delete(authorize('admin'), deleteProperty);

module.exports = router;