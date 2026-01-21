const prisma = require('../../config/db');

exports.getStats = async (audience) => {
    // 1. Calculate Sales
    // Sum of OrderItems price * quantity where audience matches
    // Only for valid orders (not cancelled)? 
    // Let's assume all for now, or maybe only status != CANCELLED if we had that on items.
    // Item status default is PENDING.

    const salesAgg = await prisma.orderItem.aggregate({
        _sum: {
            price: true // price is per unit? No, usually price is unit price. We need price * quantity.
            // Prisma aggregate doesn't do math on columns directly easily without raw query or separate fetch.
            // Wait, price in OrderItem is Decimal. quantity is Int.
            // _sum only works on columns.
            // We might need to fetch or use raw query.
        },
        where: audience ? { audience } : {}
    });

    // Actually, price * quantity needs to be calculated.
    // Let's do a raw query or fetch and reduce. Fetching might be heavy if many orders.
    // Optimization: GroupBy or Raw.
    // Let's use Raw Query for performance.

    // Note: Prisma 5 might support computed fields in aggregate? No.

    // Fallback to fetch for now or raw.
    // Using prisma.$queryRaw

    let totalSales = 0;

    if (audience) {
        const result = await prisma.$queryRaw`
            SELECT SUM(price * quantity) as total 
            FROM order_items 
            WHERE audience = ${audience}
        `;
        totalSales = result[0].total || 0;
    } else {
        const result = await prisma.$queryRaw`
            SELECT SUM(price * quantity) as total 
            FROM order_items
        `;
        totalSales = result[0].total || 0;
    }

    // 2. Count Active Orders (Items that are PENDING)
    const activeOrdersCount = await prisma.orderItem.count({
        where: {
            audience: audience || undefined,
            status: 'PENDING'
        }
    });

    // 3. Count Products
    const productsCount = await prisma.product.count({
        where: {
            audience: audience || undefined,
            isActive: true
        }
    });

    return {
        sales: Number(totalSales),
        activeOrders: activeOrdersCount,
        activeProducts: productsCount
    };
};
