const { body, query, param } = require('express-validator');
const { validationResult } = require('express-validator');
const { errorResponse } = require('./apiResponse');

// Middleware to check validation result
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(e => e.msg).join(', ');
    return errorResponse(res, messages, 422);
  }
  next();
};

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['admin', 'manager', 'agent']).withMessage('Invalid role'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const leadValidation = [
  body('name').trim().notEmpty().withMessage('Lead name is required'),
  body('email').optional().isEmail().withMessage('Valid email required').normalizeEmail(),
  body('phone').optional().trim(),
  body('source').optional().isIn(['website', 'ads', 'referral', 'call', 'walk-in', 'other']),
  body('budget').optional().isNumeric().withMessage('Budget must be a number'),
  body('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Closed', 'Lost']),
];

const propertyValidation = [
  body('title').trim().notEmpty().withMessage('Property title is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('type').isIn(['residential', 'commercial']).withMessage('Type must be residential or commercial'),
];

const dealValidation = [
  body('client').notEmpty().withMessage('Client reference is required'),
  body('property').notEmpty().withMessage('Property reference is required'),
  body('dealValue').isNumeric().withMessage('Deal value must be a number'),
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  leadValidation,
  propertyValidation,
  dealValidation,
};