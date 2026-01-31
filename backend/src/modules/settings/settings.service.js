const prisma = require('../../config/db');

exports.getSetting = async (key) => {
    return prisma.setting.findUnique({
        where: { key }
    });
};

exports.upsertSetting = async (key, value) => {
    return prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
    });
};

exports.getAllSettings = async () => {
    return prisma.setting.findMany();
};
