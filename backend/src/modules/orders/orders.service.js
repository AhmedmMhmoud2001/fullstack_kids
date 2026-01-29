const prisma = require('../../config/db');

// Create Order (Transactional)
exports.create = async (userId, itemsData, additionalData = {}) => {
    // itemsData = [{ productId, quantity }]

    // 1. Fetch products to get current price
    const productIds = itemsData.map(i => Number(i.productId));
    const products = await prisma.product.findMany({
        where: { id: { in: productIds } }
    });

    const productMap = new Map(products.map(p => [p.id, p]));

    let subtotal = 0;
    const orderItemsData = [];

    for (const item of itemsData) {
        const productId = Number(item.productId);
        const product = productMap.get(productId);
        if (!product) {
            throw new Error(`Product ${item.productId} not found`);
        }
        if (!product.isActive) {
            throw new Error(`Product ${product.name} is not active`);
        }

        const itemTotal = Number(product.price) * item.quantity;
        subtotal += itemTotal;

        orderItemsData.push({
            productId: product.id,
            productName: product.name, // Save name at time of purchase
            quantity: item.quantity,
            priceAtPurchase: product.price
        });
    }

    const shippingFee = additionalData.shippingFee || 0;
    const discount = additionalData.discount || 0;
    const totalAmount = subtotal + Number(shippingFee) - Number(discount);

    // 2. Create Order and Items
    return prisma.order.create({
        data: {
            userId,
            status: 'PENDING',
            subtotal,
            shippingFee,
            discount,
            totalAmount,
            paymentMethod: additionalData.paymentMethod || 'COD',
            notes: additionalData.notes || null,
            billingInfo: additionalData.billingInfo || null,
            shippingAddress: additionalData.shippingAddress || null,
            items: {
                create: orderItemsData
            }
        },
        include: {
            items: {
                include: { product: true }
            }
        }
    });
};

// Find All Orders (with scope filtering)
exports.findAll = async (where = {}, itemWhere = {}) => {
    // itemWhere is for filtering the *structure* of the response (e.g. only showing Kids items)
    // where is for filtering which orders to return (e.g. userId, or orders that contain Kids items)

    return prisma.order.findMany({
        where,
        include: {
            user: {
                select: { id: true, firstName: true, lastName: true, email: true }
            },
            items: {
                where: itemWhere,
                include: { product: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
};

// Find One Order
exports.findOne = async (id, itemWhere = {}) => {
    return prisma.order.findUnique({
        where: { id: parseInt(id) },
        include: {
            user: {
                select: { id: true, firstName: true, lastName: true, email: true }
            },
            items: {
                where: itemWhere,
                include: { product: true }
            }
        }
    });
};

exports.updateStatus = async (id, status) => {
    return prisma.order.update({
        where: { id: parseInt(id) },
        data: { status }
    });
};
