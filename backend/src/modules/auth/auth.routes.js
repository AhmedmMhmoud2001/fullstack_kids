const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

const { authenticate } = require('../../middlewares/auth.middleware');

router.post('/login', authController.login);
router.post('/register', authController.register);

router.get('/me', authenticate, authController.getMe);
router.put('/me', authenticate, authController.updateMe);

module.exports = router;
