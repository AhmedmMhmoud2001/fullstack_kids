const prisma = require('../../config/db');

// Create Product
exports.create = async (data) => {
    return prisma.product.create({ data });
};

// Find All (With optional scope filter)
exports.findAll = async (filter = {}) => {
    const {
        categorySlug,
        minPrice,
        maxPrice,
        brands,
        colors,
        sortBy,
        search,
        audience, // Extract audience
        ...otherFilters
    } = filter;

    const where = {
        isActive: true,
        ...otherFilters
    };

    if (audience) {
        where.audience = audience;
    }

    // Search query - with case-insensitivity (handled by DB default collation)
    if (search) {
        where.AND = [
            {
                OR: [
                    { name: { contains: search } },
                    { description: { contains: search } }
                ]
            }
        ];
    }

    // Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        if (minPrice !== undefined) where.price.gte = minPrice;
        if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    // Brands
    if (brands && brands.length > 0) {
        where.brand = {
            in: brands
        };
    }

    // Category slug
    if (categorySlug) {
        where.category = {
            slug: categorySlug
        };
    }

    // Colors (JSON filtering)
    if (colors && colors.length > 0) {
        where.OR = colors.map(color => ({
            colors: {
                path: "$",
                array_contains: color
            }
        }));
    }

    // Sorting
    let orderBy = { createdAt: 'desc' };
    if (sortBy === 'price-low') orderBy = { price: 'asc' };
    else if (sortBy === 'price-high') orderBy = { price: 'desc' };
    else if (sortBy === 'newness') orderBy = { createdAt: 'desc' };

    return prisma.product.findMany({
        where,
        include: {
            category: true,
            _count: {
                select: { favorites: true }
            }
        },
        orderBy
    });
};

// Find One
exports.findOne = async (id) => {
    return prisma.product.findUnique({
        where: { id: parseInt(id) },
        include: { category: true }
    });
};

// Update
exports.update = async (id, data) => {
    return prisma.product.update({
        where: { id: parseInt(id) },
        data
    });
};

// Get Unique Colors
exports.getUniqueColors = async () => {
    const products = await prisma.product.findMany({
        select: {
            colors: true
        }
    });

    const colors = new Set();
    products.forEach(p => {
        let productColors = p.colors;

        // Handle stringified JSON (common issue if stored incorrectly)
        if (typeof productColors === 'string') {
            try {
                productColors = JSON.parse(productColors);
            } catch (e) {
                // If not valid JSON, maybe it's just a comma separated string or single value?
                // For now, ignore or treat as single value if needed.
                // But mostly it is likely '["Red"]'
            }
        }

        if (Array.isArray(productColors)) {
            productColors.forEach(c => {
                if (c && typeof c === 'string') {
                    colors.add(c.trim());
                }
            });
        }
    });

    return Array.from(colors).sort();
};

// Delete
exports.delete = async (id) => {
    const productId = parseInt(id);
    return prisma.$transaction(async (tx) => {
        // 1. Delete Cart Items (Temporary data)
        await tx.cartItem.deleteMany({ where: { productId } });

        // 2. Delete Favorites (Temporary data)
        await tx.favorite.deleteMany({ where: { productId } });

        // 3. Finally Delete the Product
        // Note: OrderItem.productId will be set to NULL automatically by Prisma (onDelete: SetNull)
        // and the productName we saved during purchase will remain.
        return tx.product.delete({
            where: { id: productId }
        });
    });
};
