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
        ...otherFilters
    } = filter;

    const where = {
        isActive: true,
        ...otherFilters
    };

    // Search query
    if (search) {
        where.OR = [
            { name: { contains: search } },
            { description: { contains: search } }
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

// Delete
exports.delete = async (id) => {
    return prisma.product.delete({
        where: { id: parseInt(id) }
    });
};
