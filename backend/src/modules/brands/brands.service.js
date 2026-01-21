const prisma = require('../../config/db');

// Create Brand
exports.create = async (data) => {
    return prisma.brand.create({ data });
};

// Find All Brands
exports.findAll = async () => {
    return prisma.brand.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { createdAt: 'desc' }
    });
};

// Find One
exports.findOne = async (id) => {
    return prisma.brand.findUnique({
        where: { id: parseInt(id) },
        include: { products: true }
    });
};

// Update
exports.update = async (id, data) => {
    return prisma.brand.update({
        where: { id: parseInt(id) },
        data
    });
};

// Delete
exports.delete = async (id) => {
    return prisma.brand.delete({
        where: { id: parseInt(id) }
    });
};
