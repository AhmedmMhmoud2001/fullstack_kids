const cartService = require('./cart.service');
const prisma = require('../../config/db'); // For product check

exports.addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { selectedSize, selectedColor } = req.body;
        const productId = parseInt(req.body.productId);
        const quantity = parseInt(req.body.quantity);

        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: 'Quantity must be >= 1' });
        }

        // Verify Product Active
        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        if (!product.isActive) return res.status(400).json({ message: 'Product is not active' });

        const item = await cartService.addToCart(userId, { productId, quantity, selectedSize, selectedColor });
        res.status(201).json({ success: true, data: item });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;
        const quantity = parseInt(req.body.quantity);

        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: 'Quantity must be >= 1' });
        }

        const item = await cartService.updateItem(userId, itemId, quantity);
        res.json({ success: true, data: item });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.removeItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;

        await cartService.removeItem(userId, itemId);
        res.json({ success: true, message: 'Item removed from cart' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await cartService.getCart(userId);
        res.json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
