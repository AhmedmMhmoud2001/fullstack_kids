const prisma = require('../../config/db');

exports.findAll = async () => {
    return prisma.staticPage.findMany({
        orderBy: { title: 'asc' }
    });
};

exports.findOne = async (idOrSlug) => {
    const id = parseInt(idOrSlug);
    if (isNaN(id)) {
        return prisma.staticPage.findUnique({
            where: { slug: idOrSlug }
        });
    }
    return prisma.staticPage.findUnique({
        where: { id }
    });
};

exports.update = async (id, data) => {
    return prisma.staticPage.update({
        where: { id: parseInt(id) },
        data
    });
};

exports.create = async (data) => {
    return prisma.staticPage.create({ data });
};

exports.delete = async (id) => {
    return prisma.staticPage.delete({
        where: { id: parseInt(id) }
    });
};
