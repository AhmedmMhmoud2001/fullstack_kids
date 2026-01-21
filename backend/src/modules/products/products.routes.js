const express = require('express');
const router = express.Router();
const controller = require('./products.controller');
const { authenticate, authenticateOptional } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/role.middleware');

// Public Read (Optional Auth for role filtering)
router.get('/', authenticateOptional, controller.findAll);
router.get('/:id', authenticateOptional, controller.findOne);

// Protected Write
router.post('/', authenticate, authorize(['SYSTEM_ADMIN', 'ADMIN_KIDS', 'ADMIN_NEXT']), controller.create);
router.put('/:id', authenticate, authorize(['SYSTEM_ADMIN', 'ADMIN_KIDS', 'ADMIN_NEXT']), controller.update);
router.delete('/:id', authenticate, authorize(['SYSTEM_ADMIN', 'ADMIN_KIDS', 'ADMIN_NEXT']), controller.delete);

module.exports = router;
