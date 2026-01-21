const prisma = require('../../config/db');

// Create Category
exports.create = async (data) => {
    return prisma.category.create({ data });
};

// Find All Categories (with optional audience filter)
exports.findAll = async (audience = null) => {
    const where = audience ? { audience } : {};
    return prisma.category.findMany({
        where,
        include: { _count: { select: { products: true } } },
        orderBy: { createdAt: 'desc' }
    });
};

// Find One
exports.findOne = async (id) => {
    return prisma.category.findUnique({
        where: { id: parseInt(id) },
        include: { products: true }
    });
};

// Update
exports.update = async (id, data) => {
    return prisma.category.update({
        where: { id: parseInt(id) },
        data
    });
};

// Delete
exports.delete = async (id) => {
    return prisma.category.delete({
        where: { id: parseInt(id) }
    });
};
