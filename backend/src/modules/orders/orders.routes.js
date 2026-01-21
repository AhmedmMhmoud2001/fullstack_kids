const express = require('express');
const router = express.Router();
const ordersController = require('./orders.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/role.middleware');

// Create Order (Customer)
router.post('/', authenticate, ordersController.createOrder);

// Get All Orders (Customer: own, Admins: filtered)
router.get('/', authenticate, ordersController.getAllOrders);

// Get Single Order
router.get('/:id', authenticate, ordersController.getOrderById);

// Update Order Status (System Admin Only)
router.patch('/:id/status',
    authenticate,
    authorize(['SYSTEM_ADMIN']),
    ordersController.updateOrderStatus
);

// Update Order Item Status (Admins)
// We allow all admins to hit this, but we should Validate ownership inside controller or here
router.patch('/items/:itemId/status',
    authenticate,
    authorize(['SYSTEM_ADMIN', 'ADMIN_KIDS', 'ADMIN_NEXT']),
    ordersController.updateOrderItemStatus
);

module.exports = router;
