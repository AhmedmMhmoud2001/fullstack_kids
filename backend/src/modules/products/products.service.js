const prisma = require('../../config/db');

// Create Product
exports.create = async (data) => {
    return prisma.product.create({ data });
};

// Find All (With optional scope filter)
exports.findAll = async (filter = {}) => {
    const where = { isActive: true, ...filter };
    return prisma.product.findMany({
        where,
        include: {
            category: true,
            _count: {
                select: { favorites: true }
            }
        }
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
