const prisma = require('../../config/db');
const bcrypt = require('bcrypt');

// Create User
exports.create = async (data) => {
    // Hash password
    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
    }
    return prisma.user.create({
        data,
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            phone: true,
            address: true,
            city: true,
            country: true,
            image: true,
            createdAt: true,
            updatedAt: true
        } // Exclude password
    });
};

// Find All
exports.findAll = async () => {
    return prisma.user.findMany({
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            phone: true,
            address: true,
            city: true,
            country: true,
            image: true,
            createdAt: true,
            updatedAt: true
        }
    });
};

// Find One
exports.findOne = async (id) => {
    return prisma.user.findUnique({
        where: { id: parseInt(id) },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            phone: true,
            address: true,
            city: true,
            country: true,
            image: true,
            createdAt: true,
            updatedAt: true
        }
    });
};

// Update
exports.update = async (id, data) => {
    // Hash password if updating
    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
    }

    return prisma.user.update({
        where: { id: parseInt(id) },
        data,
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            phone: true,
            address: true,
            city: true,
            country: true,
            image: true,
            createdAt: true,
            updatedAt: true
        }
    });
};

// Delete
exports.delete = async (id) => {
    return prisma.user.delete({
        where: { id: parseInt(id) }
    });
};
