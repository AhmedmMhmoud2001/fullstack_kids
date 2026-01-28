import prisma from '../../config/db.js';

export const createMessage = async (data) => {
    return prisma.contactMessage.create({
        data: {
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message
        }
    });
};

export const getAllMessages = async () => {
    return prisma.contactMessage.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });
};

export const deleteMessageById = async (id) => {
    return prisma.contactMessage.delete({
        where: { id }
    });
};
