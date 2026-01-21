const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Categories...');
    const catClothing = await prisma.category.upsert({
        where: { slug: 'clothing' },
        update: {},
        create: { name: 'Clothing', slug: 'clothing' }
    });

    const catToys = await prisma.category.upsert({
        where: { slug: 'toys' },
        update: {},
        create: { name: 'Toys', slug: 'toys' }
    });

    console.log('Seeding Products...');

    // Kids Product
    await prisma.product.create({
        data: {
            title: 'Lego Set',
            description: 'A fun lego set for kids',
            price: 49.99,
            audience: 'KIDS',
            categoryId: catToys.id
        }
    });

    // Next Product
    await prisma.product.create({
        data: {
            title: 'Cool T-Shirt Next Gen',
            description: 'Trendy t-shirt for teens',
            price: 29.99,
            audience: 'NEXT',
            categoryId: catClothing.id
        }
    });

    console.log('Seed Completed');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
