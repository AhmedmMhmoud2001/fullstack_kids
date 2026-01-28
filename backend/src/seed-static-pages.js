const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const pages = [
        {
            title: 'About Us',
            slug: 'about-us',
            content: `<h1>About Kids & Co</h1>
<p>Welcome to Kids & Co, your premier destination for high-quality children's clothing and accessories. Since our founding, we've been dedicated to providing stylish, comfortable, and affordable clothing for kids of all ages.</p>

<h2>Our Mission</h2>
<p>At Kids & Co, we believe that every child deserves to look and feel their best. Our mission is to offer a carefully curated selection of clothing that combines style, comfort, and durability - all at prices that won't break the bank.</p>

<h2>What We Offer</h2>
<ul>
<li>Wide range of sizes from newborn to teens</li>
<li>Two distinct collections: Kids & Next</li>
<li>Quality fabrics that are gentle on sensitive skin</li>
<li>Trendy designs that kids love</li>
<li>Fast and reliable shipping</li>
<li>Hassle-free returns and exchanges</li>
</ul>

<h2>Our Collections</h2>
<p><strong>Kids Collection:</strong> Featuring fun, colorful designs for everyday wear and special occasions.</p>
<p><strong>Next Collection:</strong> Our premium line with sophisticated styles for fashion-forward kids.</p>

<h2>Quality Promise</h2>
<p>Every item in our store is carefully selected for quality and durability. We work with trusted suppliers and brands to ensure that our products meet the highest standards.</p>

<p>Thank you for choosing Kids & Co. We're honored to be part of your child's growing years!</p>`,
            isActive: true
        },
        {
            title: 'FAQs',
            slug: 'faqs',
            content: `<h1>Frequently Asked Questions</h1>

<h2>Orders & Shipping</h2>
<h3>How long does shipping take?</h3>
<p>Standard shipping typically takes 3-5 business days. Express shipping options are available at checkout for faster delivery (1-2 business days).</p>

<h3>Do you ship internationally?</h3>
<p>Currently, we ship within Egypt only. International shipping will be available soon.</p>

<h3>How can I track my order?</h3>
<p>Once your order ships, you'll receive a tracking number via email. You can also check your order status in your account dashboard.</p>

<h2>Returns & Exchanges</h2>
<h3>What is your return policy?</h3>
<p>We offer a 30-day return policy for unworn, unwashed items with original tags attached. Full refunds are provided for returned items.</p>

<h3>How do I initiate a return?</h3>
<p>Contact our customer service team or log into your account to start a return. We'll provide you with a prepaid return label.</p>

<h2>Sizing & Products</h2>
<h3>How do I choose the right size?</h3>
<p>Each product page includes a detailed size chart. If you're between sizes, we recommend ordering the larger size for growing children.</p>

<h3>Are your clothes machine washable?</h3>
<p>Yes! Most of our items are machine washable. Care instructions are provided on each product page and garment tag.</p>

<h2>Payment & Security</h2>
<h3>What payment methods do you accept?</h3>
<p>We accept all major credit cards, debit cards, and cash on delivery (COD) for eligible orders.</p>

<h3>Is my payment information secure?</h3>
<p>Absolutely. We use industry-standard encryption to protect your personal and payment information.</p>

<h2>Account & Support</h2>
<h3>Do I need an account to order?</h3>
<p>While you can checkout as a guest, creating an account allows you to track orders, save favorites, and checkout faster.</p>

<h3>How can I contact customer support?</h3>
<p>You can reach us via the contact form on our website, email us at support@kidsandco.com, or call our hotline during business hours.</p>`,
            isActive: true
        },
        {
            title: 'Delivery & Returns',
            slug: 'delivery-returns',
            content: `<h1>Delivery & Returns Policy</h1>

<h2>Delivery Information</h2>

<h3>Shipping Methods</h3>
<ul>
<li><strong>Standard Shipping:</strong> 3-5 business days - Free on orders over 500 EGP</li>
<li><strong>Express Shipping:</strong> 1-2 business days - 50 EGP flat rate</li>
<li><strong>Same-Day Delivery:</strong> Available in select areas - 100 EGP</li>
</ul>

<h3>Delivery Times</h3>
<p>Orders placed before 2 PM are typically processed the same day. Delivery times may vary during holidays and peak seasons.</p>

<h3>Order Tracking</h3>
<p>Track your order in real-time using the tracking number sent to your email. You can also check your order status in your account dashboard.</p>

<h2>Returns Policy</h2>

<h3>30-Day Return Window</h3>
<p>You have 30 days from the date of delivery to return any item. Items must be:</p>
<ul>
<li>Unworn and unwashed</li>
<li>In original condition with all tags attached</li>
<li>In original packaging when possible</li>
</ul>

<h3>How to Return</h3>
<ol>
<li>Log into your account and go to Order History</li>
<li>Select the order and click "Return Items"</li>
<li>Choose items to return and provide reason</li>
<li>Print the prepaid return label we email you</li>
<li>Pack items securely and attach the label</li>
<li>Drop off at any authorized courier location</li>
</ol>

<h3>Refunds</h3>
<p>Once we receive and inspect your return, we'll process your refund within 5-7 business days. Refunds are issued to the original payment method.</p>

<h2>Exchanges</h2>
<p>Need a different size or color? We make exchanges easy! Follow the same return process and place a new order for the item you want. We'll process your refund promptly.</p>

<h2>Damaged or Defective Items</h2>
<p>If you receive a damaged or defective item, please contact us within 48 hours of delivery. We'll arrange a free return and send a replacement or provide a full refund.</p>

<h2>Non-Returnable Items</h2>
<p>For hygiene reasons, certain items cannot be returned:</p>
<ul>
<li>Underwear and innerwear</li>
<li>Swimwear (unless unopened)</li>
<li>Face masks</li>
<li>Personalized or custom items</li>
</ul>

<h2>Contact Us</h2>
<p>Have questions about delivery or returns? Contact our customer service team at support@kidsandco.com or call us during business hours.</p>`,
            isActive: true
        },
        {
            title: 'Privacy Policy',
            slug: 'privacy-policy',
            content: `<h1>Privacy Policy</h1>
<p><em>Last updated: January 2026</em></p>

<h2>Introduction</h2>
<p>At Kids & Co, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data.</p>

<h2>Information We Collect</h2>
<h3>Personal Information</h3>
<ul>
<li>Name, email address, and phone number</li>
<li>Shipping and billing addresses</li>
<li>Payment information (processed securely by our payment partners)</li>
<li>Order history and preferences</li>
</ul>

<h3>Automatically Collected Information</h3>
<ul>
<li>Browser type and IP address</li>
<li>Pages visited and time spent on site</li>
<li>Referring website addresses</li>
<li>Device information</li>
</ul>

<h2>How We Use Your Information</h2>
<p>We use your information to:</p>
<ul>
<li>Process and fulfill your orders</li>
<li>Communicate about your orders and account</li>
<li>Send promotional emails (with your consent)</li>
<li>Improve our website and services</li>
<li>Prevent fraud and enhance security</li>
<li>Comply with legal obligations</li>
</ul>

<h2>Information Sharing</h2>
<p>We do not sell your personal information. We may share your data with:</p>
<ul>
<li><strong>Service Providers:</strong> Shipping companies, payment processors, and marketing partners</li>
<li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
<li><strong>Business Transfers:</strong> In the event of a merger or acquisition</li>
</ul>

<h2>Data Security</h2>
<p>We implement industry-standard security measures to protect your information, including:</p>
<ul>
<li>SSL encryption for data transmission</li>
<li>Secure servers and databases</li>
<li>Regular security audits</li>
<li>Limited access to personal information</li>
</ul>

<h2>Your Rights</h2>
<p>You have the right to:</p>
<ul>
<li>Access your personal information</li>
<li>Correct inaccurate data</li>
<li>Request deletion of your data</li>
<li>Opt-out of marketing communications</li>
<li>Object to data processing</li>
</ul>

<h2>Cookies</h2>
<p>We use cookies to enhance your browsing experience. You can control cookie settings through your browser preferences.</p>

<h2>Children's Privacy</h2>
<p>While we sell children's products, our website is intended for use by adults. We do not knowingly collect information from children under 13.</p>

<h2>Changes to This Policy</h2>
<p>We may update this Privacy Policy periodically. We'll notify you of significant changes via email or website notice.</p>

<h2>Contact Us</h2>
<p>If you have questions about this Privacy Policy, please contact us at privacy@kidsandco.com</p>`,
            isActive: true
        },
        {
            title: 'Terms & Conditions',
            slug: 'terms-conditions',
            content: `<h1>Terms & Conditions</h1>
<p><em>Last updated: January 2026</em></p>

<h2>1. Agreement to Terms</h2>
<p>By accessing and using the Kids & Co website and services, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access our services.</p>

<h2>2. Use of Our Service</h2>
<h3>Account Registration</h3>
<ul>
<li>You must be at least 18 years old to create an account</li>
<li>You are responsible for maintaining account security</li>
<li>You must provide accurate and complete information</li>
<li>One person may not maintain multiple accounts</li>
</ul>

<h3>Prohibited Activities</h3>
<p>You may not:</p>
<ul>
<li>Use the service for any illegal purpose</li>
<li>Attempt to access unauthorized areas</li>
<li>Interfere with the proper functioning of the website</li>
<li>Transmit viruses or malicious code</li>
<li>Harvest data from other users</li>
</ul>

<h2>3. Products & Pricing</h2>
<ul>
<li>All prices are in Egyptian Pounds (EGP) unless otherwise stated</li>
<li>We reserve the right to change prices without notice</li>
<li>Product images are for illustration; actual products may vary slightly</li>
<li>We do not guarantee product availability</li>
<li>We reserve the right to limit order quantities</li>
</ul>

<h2>4. Orders & Payment</h2>
<h3>Order Acceptance</h3>
<p>Your order is an offer to purchase. We reserve the right to accept or reject any order. We'll notify you of acceptance via email.</p>

<h3>Payment</h3>
<ul>
<li>Payment must be made at time of order</li>
<li>We accept credit/debit cards and cash on delivery</li>
<li>Prices include applicable taxes</li>
<li>Failed payments may result in order cancellation</li>
</ul>

<h2>5. Shipping & Delivery</h2>
<ul>
<li>Delivery times are estimates, not guarantees</li>
<li>Risk of loss passes to you upon delivery</li>
<li>We are not responsible for delays caused by shipping carriers</li>
<li>Undeliverable packages may incur return shipping fees</li>
</ul>

<h2>6. Returns & Refunds</h2>
<p>Please refer to our Delivery & Returns Policy for detailed information. All returns are subject to inspection and approval.</p>

<h2>7. Intellectual Property</h2>
<ul>
<li>All content on this website is owned by Kids & Co</li>
<li>You may not reproduce, distribute, or modify our content</li>
<li>Our logos and trademarks are protected by law</li>
<li>Unauthorized use may result in legal action</li>
</ul>

<h2>8. User Content</h2>
<p>By submitting reviews, photos, or other content, you grant us a worldwide, royalty-free license to use, reproduce, and display that content.</p>

<h2>9. Disclaimer of Warranties</h2>
<p>Our services are provided "as is" without warranties of any kind. We do not guarantee uninterrupted or error-free service.</p>

<h2>10. Limitation of Liability</h2>
<p>Kids & Co shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services.</p>

<h2>11. Indemnification</h2>
<p>You agree to indemnify and hold Kids & Co harmless from any claims arising from your use of our services or violation of these terms.</p>

<h2>12. Governing Law</h2>
<p>These terms are governed by the laws of Egypt. Any disputes shall be resolved in Egyptian courts.</p>

<h2>13. Changes to Terms</h2>
<p>We reserve the right to modify these terms at any time. Continued use of our services constitutes acceptance of modified terms.</p>

<h2>14. Contact Information</h2>
<p>For questions about these Terms & Conditions, contact us at legal@kidsandco.com</p>`,
            isActive: true
        },
        {
            title: 'Contact Us',
            slug: 'contact',
            content: `<h1>Contact Us</h1>

<h2>Get In Touch</h2>
<p>We'd love to hear from you! Whether you have a question about products, orders, or anything else, our team is ready to help.</p>

<h2>Customer Service</h2>
<p><strong>Email:</strong> support@kidsandco.com</p>
<p><strong>Phone:</strong> +20 123 456 7890</p>
<p><strong>Hours:</strong> Saturday - Thursday, 9:00 AM - 6:00 PM (EET)</p>
<p><em>Closed on Fridays and public holidays</em></p>

<h2>Office Address</h2>
<p>Kids & Co Headquarters<br>
123 Mohamed Farid Street<br>
Downtown, Cairo<br>
Egypt 11511</p>

<h2>Business Inquiries</h2>
<p><strong>Partnerships:</strong> partners@kidsandco.com</p>
<p><strong>Press & Media:</strong> media@kidsandco.com</p>
<p><strong>Careers:</strong> careers@kidsandco.com</p>

<h2>Social Media</h2>
<p>Follow us on social media for the latest updates, promotions, and inspiration:</p>
<ul>
<li><strong>Facebook:</strong> @KidsAndCoEgypt</li>
<li><strong>Instagram:</strong> @kidsandco_official</li>
<li><strong>Twitter:</strong> @KidsAndCoEG</li>
</ul>

<h2>Feedback</h2>
<p>Your feedback helps us improve! Share your thoughts, suggestions, or concerns at feedback@kidsandco.com</p>

<p><em>We typically respond to all inquiries within 24 hours during business days.</em></p>`,
            isActive: true
        }
    ];

    for (const page of pages) {
        await prisma.staticPage.upsert({
            where: { slug: page.slug },
            update: {},
            create: page,
        });
    }

    console.log('Static pages seeded!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
