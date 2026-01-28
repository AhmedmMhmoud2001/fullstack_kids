import express from 'express';
import { sendMessage, getMessages, deleteMessage } from './contact.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { allowRoles } from '../../middlewares/role.middleware.js';

const router = express.Router();

// Public – Contact Us form
router.post('/', sendMessage);

// Dashboard – SYSTEM_ADMIN only
router.get(
    '/',
    authMiddleware,
    allowRoles('SYSTEM_ADMIN'),
    getMessages
);

router.delete(
    '/:id',
    authMiddleware,
    allowRoles('SYSTEM_ADMIN'),
    deleteMessage
);

export default router;
