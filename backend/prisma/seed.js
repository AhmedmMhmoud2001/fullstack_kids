const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    console.log('--- Starting Seed ---');

    // 1. Users
    const password = await bcrypt.hash('password123', 10);
    const users = [
        { email: 'customer@example.com', firstName: 'Customer', lastName: 'User', role: 'CUSTOMER' },
        { email: 'admin.kids@example.com', firstName: 'Kids', lastName: 'Admin', role: 'ADMIN_KIDS' },
        { email: 'admin.next@example.com', firstName: 'Next', lastName: 'Admin', role: 'ADMIN_NEXT' },
        { email: 'system@example.com', firstName: 'System', lastName: 'Admin', role: 'SYSTEM_ADMIN' },
    ];

    for (const user of users) {
        await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                password: password,
                role: user.role,
            },
        });
    }
    console.log('✅ Users seeded');

    // 2. Brands
    const brandsData = [
        { name: 'Nike', slug: 'nike', image: 'https://placehold.co/150?text=Nike' },
        { name: 'Adidas', slug: 'adidas', image: 'https://placehold.co/150?text=Adidas' },
        { name: 'Puma', slug: 'puma', image: 'https://placehold.co/150?text=Puma' },
        { name: 'Zara', slug: 'zara', image: 'https://placehold.co/150?text=Zara' },
    ];

    const brands = [];
    for (const b of brandsData) {
        const brand = await prisma.brand.upsert({
            where: { slug: b.slug },
            update: {},
            create: b,
        });
        brands.push(brand);
    }
    console.log('✅ Brands seeded');

    // 3. Categories
    const categoriesData = [
        { name: 'Clothing', slug: 'clothing', audience: 'KIDS', image: 'https://placehold.co/300?text=Kids+Clothing' },
        { name: 'Toys', slug: 'toys', audience: 'KIDS', image: 'https://placehold.co/300?text=Kids+Toys' },
        { name: 'Accessories', slug: 'accessories', audience: 'KIDS', image: 'https://placehold.co/300?text=Kids+Acc' },
        { name: 'Clothing', slug: 'clothing', audience: 'NEXT', image: 'https://placehold.co/300?text=Next+Clothing' },
        { name: 'Shoes', slug: 'shoes', audience: 'NEXT', image: 'https://placehold.co/300?text=Next+Shoes' },
    ];

    const categories = [];
    for (const c of categoriesData) {
        const category = await prisma.category.upsert({
            where: { slug_audience: { slug: c.slug, audience: c.audience } },
            update: {},
            create: c,
        });
        categories.push(category);
    }
    console.log('✅ Categories seeded');

    // 4. Products
    const kidsClothingCat = categories.find(c => c.slug === 'clothing' && c.audience === 'KIDS');
    const kidsToysCat = categories.find(c => c.slug === 'toys' && c.audience === 'KIDS');
    const nextClothingCat = categories.find(c => c.slug === 'clothing' && c.audience === 'NEXT');

    const productsData = [
        {
            name: 'Summer Cotton T-Shirt',
            description: 'Soft and breathable cotton t-shirt for kids.',
            price: 250,
            sku: 'KID-TSH-001',
            brand: 'Nike',
            audience: 'KIDS',
            stock: 100,
            thumbnails: JSON.stringify(['https://placehold.co/600x600/FFB6C1/FFFFFF?text=Kids+T-Shirt']),
            colors: JSON.stringify(['Blue', 'Red', 'White']),
            sizes: JSON.stringify(['S', 'M', 'L']),
            categoryId: kidsClothingCat.id,
            brandId: brands.find(b => b.name === 'Nike').id,
            isBestSeller: true
        },
        {
            name: 'Remote Control Car',
            description: 'High-speed RC car with rechargeable batteries.',
            price: 1200,
            sku: 'KID-TOY-002',
            brand: 'Puma',
            audience: 'KIDS',
            stock: 50,
            thumbnails: JSON.stringify(['https://placehold.co/600x600/ADD8E6/FFFFFF?text=RC+Car']),
            colors: JSON.stringify(['Red', 'Black']),
            categoryId: kidsToysCat.id,
            brandId: brands.find(b => b.name === 'Puma').id
        },
        {
            name: 'Next Gen Street Hoodie',
            description: 'Stylish oversized hoodie for teenagers.',
            price: 1500,
            sku: 'NXT-HOD-101',
            brand: 'Zara',
            audience: 'NEXT',
            stock: 30,
            thumbnails: JSON.stringify(['https://placehold.co/600x600/333333/FFFFFF?text=Next+Hoodie']),
            colors: JSON.stringify(['Grey', 'Dark Blue']),
            sizes: JSON.stringify(['M', 'L', 'XL']),
            categoryId: nextClothingCat.id,
            brandId: brands.find(b => b.name === 'Zara').id,
            isBestSeller: true
        }
    ];

    for (const p of productsData) {
        await prisma.product.upsert({
            where: { sku: p.sku },
            update: {},
            create: p,
        });
    }
    console.log('✅ Products seeded');

    // 5. Coupons
    const couponsData = [
        { code: 'KIDS10', type: 'PERCENT', value: 10, minOrderAmount: 500, isActive: true },
        { code: 'SAVE100', type: 'FIXED', value: 100, minOrderAmount: 1000, isActive: true },
        { code: 'WELCOME', type: 'PERCENT', value: 20, usageLimit: 100, isActive: true },
    ];

    for (const cp of couponsData) {
        await prisma.coupon.upsert({
            where: { code: cp.code },
            update: {},
            create: cp,
        });
    }
    console.log('✅ Coupons seeded');

    // 6. Static Pages
    const staticPagesData = [
        {
            title: 'About Us',
            slug: 'about-us',
            content: `
                <p>Welcome to <strong>Kids & Co.</strong>, your number one source for all things kids' fashion. We're dedicated to giving you the very best of children's clothing, with a focus on quality, comfort, and unique style.</p>
                <p>Founded in 2024, Kids & Co. has come a long way from its beginnings. When we first started out, our passion for "quality fashion for little ones" drove us to start our own business.</p>
                <p>We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please please don't hesitate to contact us.</p>
            `,
            isActive: true
        },
        {
            title: 'Frequently Asked Questions',
            slug: 'faq',
            content: `
                <h3>How can I track my order?</h3>
                <p>Once your order has been shipped, you will receive an email with a tracking number and a link to track your package.</p>
                <h3>What is your return policy?</h3>
                <p>We offer a 14-day return policy for most items. Items must be in their original condition and packaging.</p>
                <h3>Do you ship internationally?</h3>
                <p>Currently, we only ship within Egypt and selected Gulf countries (UAE, Saudi Arabia, Kuwait).</p>
            `,
            isActive: true
        },
        {
            title: 'Delivery & Return',
            slug: 'delivery-return',
            content: `
                <h2>Delivery Information</h2>
                <p>We offer standard delivery within 3-5 business days. Delivery costs are fixed at 150 EE for all orders within Egypt.</p>
                <h2>Return & Exchange</h2>
                <p>If you are not satisfied with your purchase, you can return it within 14 days of delivery. Please contact our support team to initiate a return.</p>
            `,
            isActive: true
        }
    ];

    for (const sp of staticPagesData) {
        await prisma.staticPage.upsert({
            where: { slug: sp.slug },
            update: {},
            create: sp,
        });
    }
    console.log('✅ Static Pages seeded');

    console.log('--- Seed Completed Successfully ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
