const express = require('express');
const router = express.Router();
const controller = require('./users.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/role.middleware');

// Routes logic:
// - All routes require Authentication
// - All routes require SYSTEM_ADMIN role
// - Others get 403 (handled by authorize)

// Middleware Wrapper for readability
const requireSystemAdmin = [authenticate, authorize(['SYSTEM_ADMIN'])];

router.post('/', ...requireSystemAdmin, controller.create);
router.get('/', ...requireSystemAdmin, controller.findAll);
router.get('/:id', ...requireSystemAdmin, controller.findOne);
router.put('/:id', ...requireSystemAdmin, controller.update);
router.delete('/:id', ...requireSystemAdmin, controller.delete);

module.exports = router;
