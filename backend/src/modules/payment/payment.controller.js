const prisma = require('../../config/db');

exports.processPayment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ success: false, message: 'Order ID is required' });
        }

        // 1. Find Order
        const order = await prisma.order.findUnique({
            where: { id: parseInt(orderId) }
        });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Security check: ensure order belongs to user
        if (order.userId !== userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        if (order.paymentStatus === 'PAID') {
            return res.status(400).json({ success: false, message: 'Order is already paid' });
        }

        // 2. Mock Payment Logic
        console.log(`Processing mock payment for Order #${orderId}...`);

        // Wait 1 second to simulate processing
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 3. Update Order Payment Status
        const updatedOrder = await prisma.order.update({
            where: { id: order.id },
            data: {
                paymentStatus: 'PAID',
                status: 'PROCESSING' // Move order to processing once paid
            }
        });

        res.json({
            success: true,
            message: 'Payment processed successfully',
            data: updatedOrder
        });

    } catch (error) {
        console.error('Payment Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
