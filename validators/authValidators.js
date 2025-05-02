const { body } = require('express-validator');

// Validation for login
const loginValidation = [
  body('email')
    .trim()
    .isEmail().withMessage('A valid email is required.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.')
    .notEmpty().withMessage('Password is required.')
];

// Validation for registration
const registerValidation = [
  body('email')
    .trim()
    .isEmail().withMessage('A valid email is required.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.')
    .notEmpty().withMessage('Password is required.'),
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required.')
    .isLength({ min: 2, max: 30 }).withMessage('First name must be 2-30 characters.'),
  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required.')
    .isLength({ min: 2, max: 30 }).withMessage('Last name must be 2-30 characters.')
];

module.exports = {
  loginValidation,
  registerValidation
};
