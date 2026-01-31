const orderService = require('./orders.service');

// Create Order (Customer)
exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            items,
            paymentMethod,
            notes,
            billingInfo,
            shippingAddress,
            shippingFee,
            discount,
            couponCode
        } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        const order = await orderService.create(userId, items, {
            paymentMethod,
            notes,
            billingInfo,
            shippingAddress,
            shippingFee,
            discount,
            couponCode
        });

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
            where.items = { some: { product: { audience: 'KIDS' } } };
            itemWhere.product = { audience: 'KIDS' };
        } else if (user.role === 'ADMIN_NEXT' || (user.role === 'SYSTEM_ADMIN' && audience === 'NEXT')) {
            where.items = { some: { product: { audience: 'NEXT' } } };
            itemWhere.product = { audience: 'NEXT' };
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
            itemWhere.product = { audience: 'KIDS' };
        } else if (user.role === 'ADMIN_NEXT' || (user.role === 'SYSTEM_ADMIN' && audience === 'NEXT')) {
            itemWhere.product = { audience: 'NEXT' };
        }

        const order = await orderService.findOne(id, itemWhere);
        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status, cancelReason } = req.body;

        const order = await orderService.updateStatus(id, status, cancelReason);
        res.json({ success: true, data: order });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
