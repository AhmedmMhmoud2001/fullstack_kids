const express = require('express');
const router = express.Router();
const controller = require('./payment.controller');
const { authenticate } = require('../../middlewares/auth.middleware');

router.post('/', authenticate, controller.processPayment);

module.exports = router;
