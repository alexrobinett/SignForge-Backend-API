const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const loginLimiter = require('../middleware/loginLimiter');
const { loginValidation, registerValidation } = require('../validators/authValidators');
const { validationResult } = require('express-validator');

// Middleware to handle validation errors
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

router.route('/')
    .post(loginLimiter, loginValidation, handleValidationErrors, authController.login);

router.route('/refresh')
    .get(authController.refresh)

router.route('/logout')
    .post(authController.logout)

router.route('/register')
    .post(registerValidation, handleValidationErrors, authController.register);

module.exports = router