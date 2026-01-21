const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('password123', 10);

    const users = [
        { email: 'customer@example.com', name: 'Customer User', role: 'CUSTOMER' },
        { email: 'admin.kids@example.com', name: 'Kids Admin', role: 'ADMIN_KIDS' },
        { email: 'admin.next@example.com', name: 'Next Admin', role: 'ADMIN_NEXT' },
        { email: 'system@example.com', name: 'System Admin', role: 'SYSTEM_ADMIN' },
    ];

    for (const user of users) {
        const upsertUser = await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
                email: user.email,
                name: user.name,
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
