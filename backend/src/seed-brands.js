const prisma = require('./config/db');

const brands = [
    {
        name: 'Nike',
        slug: 'nike',
        image: 'https://placehold.co/200x100/FFFFFF/000000?text=NIKE',
        description: 'Leading sports brand offering premium athletic wear for kids',
        isActive: true
    },
    {
        name: 'Adidas',
        slug: 'adidas',
        image: 'https://placehold.co/200x100/FFFFFF/000000?text=ADIDAS',
        description: 'Quality sportswear and casual clothing for active children',
        isActive: true
    },
    {
        name: 'Zara Kids',
        slug: 'zara-kids',
        image: 'https://placehold.co/200x100/FFFFFF/000000?text=ZARA+KIDS',
        description: 'Trendy and fashionable clothing for modern kids',
        isActive: true
    },
    {
        name: 'H&M Kids',
        slug: 'hm-kids',
        image: 'https://placehold.co/200x100/FFFFFF/000000?text=H%26M+KIDS',
        description: 'Affordable and stylish everyday wear for children',
        isActive: true
    },
    {
        name: 'Gap Kids',
        slug: 'gap-kids',
        image: 'https://placehold.co/200x100/FFFFFF/000000?text=GAP+KIDS',
        description: 'Classic American style for kids of all ages',
        isActive: true
    },
    {
        name: 'Carter\'s',
        slug: 'carters',
        image: 'https://placehold.co/200x100/FFFFFF/000000?text=CARTERS',
        description: 'Trusted brand for baby and toddler clothing',
        isActive: true
    }
];

async function seedBrands() {
    console.log('🌱 Seeding Brands...\n');

    for (const brand of brands) {
        try {
            await prisma.brand.upsert({
                where: { slug: brand.slug },
                update: brand,
                create: brand
            });
            console.log(`   ✅ ${brand.name}`);
        } catch (error) {
            console.error(`   ❌ Error adding ${brand.name}:`, error.message);
        }
    }

    console.log('\n✨ Brands Seeded Successfully!');
}

seedBrands()
    .catch(e => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

