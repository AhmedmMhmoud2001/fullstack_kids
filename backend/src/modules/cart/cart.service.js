const prisma = require('../../config/db');

// Add Item
exports.addToCart = async (userId, data) => {
    // 1. Get or Create Cart
    let cart = await prisma.cart.findUnique({
        where: { userId }
    });

    if (!cart) {
        cart = await prisma.cart.create({ data: { userId } });
    }

    // 2. Check if item exists (same product + same variants)
    const existingItem = await prisma.cartItem.findFirst({
        where: {
            cartId: cart.id,
            productId: data.productId,
            selectedSize: data.selectedSize || null,
            selectedColor: data.selectedColor || null
        }
    });

    if (existingItem) {
        // Update quantity
        return prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + data.quantity },
            include: { product: true }
        });
    }

    // 3. Create new item
    return prisma.cartItem.create({
        data: {
            cartId: cart.id,
            productId: data.productId,
            quantity: data.quantity,
            selectedSize: data.selectedSize || null,
            selectedColor: data.selectedColor || null
        },
        include: { product: true }
    });
};

// Update Item Quantity
exports.updateItem = async (userId, itemId, quantity) => {
    // Check if cart exists for user
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new Error('Cart not found');

    // Check if item belongs to this cart
    const item = await prisma.cartItem.findFirst({
        where: {
            id: parseInt(itemId),
            cartId: cart.id
        }
    });

    if (!item) throw new Error('Item not found in your cart');

    return prisma.cartItem.update({
        where: { id: item.id },
        data: { quantity },
        include: { product: true }
    });
};

// Remove Item
exports.removeItem = async (userId, itemId) => {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new Error('Cart not found');

    const item = await prisma.cartItem.findFirst({
        where: {
            id: parseInt(itemId),
            cartId: cart.id
        }
    });

    if (!item) throw new Error('Item not found in your cart');

    return prisma.cartItem.delete({
        where: { id: item.id }
    });
};

// Get Cart
exports.getCart = async (userId) => {
    const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
            items: {
                include: { product: true }
            }
        }
    });

    return cart || { items: [] };
};

// Clear Cart
exports.clearCart = async (userId) => {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) return;

    return prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
    });
};
