const prisma = require('../../config/db');

// Create Coupon
exports.create = async (data) => {
    return prisma.coupon.create({ data });
};

// Get All Coupons
exports.findAll = async () => {
    return prisma.coupon.findMany({
        orderBy: { createdAt: 'desc' },
    });
};

// Get Single Coupon
exports.findOne = async (id) => {
    return prisma.coupon.findUnique({
        where: { id: parseInt(id, 10) },
    });
};

// Update Coupon
exports.update = async (id, data) => {
    return prisma.coupon.update({
        where: { id: parseInt(id, 10) },
        data,
    });
};

// Delete Coupon
exports.delete = async (id) => {
    return prisma.coupon.delete({
        where: { id: parseInt(id, 10) },
    });
};

// Find by Code
exports.findByCode = async (code) => {
    return prisma.coupon.findUnique({
        where: { code: String(code).toUpperCase() },
    });
};


