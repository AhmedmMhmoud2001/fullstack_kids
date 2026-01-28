const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('password123', 10);

    const users = [
        { email: 'customer@example.com', firstName: 'Customer User', role: 'CUSTOMER' },
        { email: 'admin.kids@example.com', firstName: 'Kids Admin', role: 'ADMIN_KIDS' },
        { email: 'admin.next@example.com', firstName: 'Next Admin', role: 'ADMIN_NEXT' },
        { email: 'system@example.com', firstName: 'System Admin', role: 'SYSTEM_ADMIN' },
    ];

    for (const user of users) {
        const upsertUser = await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
                email: user.email,
                firstName: user.firstName,
                password: password,
                role: user.role,
            },
        });
        console.log(`Created user: ${upsertUser.email} with role ${upsertUser.role}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
