const express = require('express');
const { sendMessage, getMessages, deleteMessage } = require('./contact.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/role.middleware');

const router = express.Router();

// Public – Contact Us form
router.post('/', sendMessage);

// Dashboard – SYSTEM_ADMIN only
router.get(
    '/',
    authenticate,
    authorize('SYSTEM_ADMIN'),
    getMessages
);

router.delete(
    '/:id',
    authenticate,
    authorize('SYSTEM_ADMIN'),
    deleteMessage
);

module.exports = router;
