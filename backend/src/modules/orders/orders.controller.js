const orderService = require('./orders.service');

// Create Order (Customer)
exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { items } = req.body; // Expect [{ productId, quantity }]

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        const order = await orderService.create(userId, items);
        res.status(201).json({ success: true, data: order });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get All Orders (Dashboard / My Orders)
exports.getAllOrders = async (req, res) => {
    try {
        const user = req.user;
        const { audience } = req.query; // Optional override/filter for System Admin
        let where = {};
        let itemWhere = {};

        // 1. Role-based filtering + optional Audience filter
        if (user.role === 'CUSTOMER') {
            where.userId = user.id;
        } else if (user.role === 'ADMIN_KIDS' || (user.role === 'SYSTEM_ADMIN' && audience === 'KIDS')) {
            where.items = { some: { audience: 'KIDS' } };
            itemWhere.audience = 'KIDS';
        } else if (user.role === 'ADMIN_NEXT' || (user.role === 'SYSTEM_ADMIN' && audience === 'NEXT')) {
            where.items = { some: { audience: 'NEXT' } };
            itemWhere.audience = 'NEXT';
        } else if (user.role === 'SYSTEM_ADMIN') {
            // See everything
        } else {
            return res.status(403).json({ message: 'Unauthorized access to orders' });
        }

        const orders = await orderService.findAll(where, itemWhere);
        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Single Order
exports.getOrderById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const user = req.user;
        const { audience } = req.query; // Optional override
        let itemWhere = {};

        // 1. Fetch first to check ownership if Customer
        const orderCheck = await orderService.findOne(id);
        if (!orderCheck) return res.status(404).json({ message: 'Order not found' });

        if (user.role === 'CUSTOMER' && orderCheck.userId !== user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // 2. Admin Scope filtering for details
        if (user.role === 'ADMIN_KIDS' || (user.role === 'SYSTEM_ADMIN' && audience === 'KIDS')) {
            itemWhere.audience = 'KIDS';
        } else if (user.role === 'ADMIN_NEXT' || (user.role === 'SYSTEM_ADMIN' && audience === 'NEXT')) {
            itemWhere.audience = 'NEXT';
        }

        const order = await orderService.findOne(id, itemWhere);

        // Security check: If Admin Kids tries to view an order that is PURELY Next, they might get an order with empty items.
        // That is technically "seeing the order" (header) but not items.
        // Requirement: "Admin Kids sees only Kids items". 
        // If an order exists but has 0 kids items (filtered out), maybe we should return 404 or just empty items?
        // Empty items seems safer and consistent with "sees only Kids items".

        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Order Status (System Admin mostly? Or maybe separate endpoint)
exports.updateOrderStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;

        // Only System Admin might change potentially the whole order status? Use Role Middleware for this.

        const order = await orderService.updateStatus(id, status);
        res.json({ success: true, data: order });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Update Order Item Status (ScopedAdmins)
exports.updateOrderItemStatus = async (req, res) => {
    try {
        const itemId = parseInt(req.params.itemId);
        const { status } = req.body;
        const user = req.user;

        // 1. Fetch Item to check audience
        const prisma = require('../../config/db');
        const item = await prisma.orderItem.findUnique({
            where: { id: itemId }
        });

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // 2. Strict Access Control
        if (user.role === 'ADMIN_KIDS' && item.audience !== 'KIDS') {
            return res.status(403).json({ message: 'Access denied: Cannot update NEXT items' });
        }
        if (user.role === 'ADMIN_NEXT' && item.audience !== 'NEXT') {
            return res.status(403).json({ message: 'Access denied: Cannot update KIDS items' });
        }

        const updatedItem = await orderService.updateItemStatus(itemId, status);
        res.json({ success: true, data: updatedItem });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
