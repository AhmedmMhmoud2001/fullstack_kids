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

// Update Order Status (Admins)
router.patch('/:id/status',
    authenticate,
    authorize(['SYSTEM_ADMIN', 'ADMIN_KIDS', 'ADMIN_NEXT']),
    ordersController.updateOrderStatus
);

module.exports = router;
