const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const pages = [
        {
            title: 'Terms & Conditions',
            slug: 'terms-conditions',
            content: `
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
        <h2>2. Use License</h2>
        <p>Permission is granted to temporarily download one copy of the materials (information or software) on Kids & Co.'s website for personal, non-commercial transitory viewing only.</p>
        <h2>3. Disclaimer</h2>
        <p>The materials on Kids & Co.'s website are provided on an 'as is' basis. Kids & Co. makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
      `
        },
        {
            title: 'Privacy Policy',
            slug: 'privacy-policy',
            content: `
        <h2>Privacy Policy</h2>
        <p>Your privacy is important to us. It is Kids & Co.'s policy to respect your privacy regarding any information we may collect from you across our website.</p>
        <h2>Information We Collect</h2>
        <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.</p>
        <h2>Security</h2>
        <p>We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.</p>
      `
        }
    ];

    for (const page of pages) {
        await prisma.staticPage.upsert({
            where: { slug: page.slug },
            update: {},
            create: {
                ...page,
                isActive: true
            }
        });
        console.log(`Upserted static page: ${page.title}`);
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
