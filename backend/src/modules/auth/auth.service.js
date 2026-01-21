const prisma = require('../../config/db');
const bcrypt = require('bcrypt');
const { generateToken } = require('../../utils/jwt');

const ROLE_REDIRECTS = {
    CUSTOMER: '/',
    ADMIN_KIDS: '/dashboard/kids',
    ADMIN_NEXT: '/dashboard/next',
    SYSTEM_ADMIN: '/dashboard'
};

const AUDIENCE_SCOPES = {
    ADMIN_KIDS: 'kids',
    ADMIN_NEXT: 'next',
    SYSTEM_ADMIN: 'all',
    CUSTOMER: 'public'
};

exports.login = async (email, password) => {
    // 1. Find User
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new Error('Invalid credentials');
    }

    // 2. Verify Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    // 3. Determine Redirect Path & Scope
    const redirectPath = ROLE_REDIRECTS[user.role] || '/';
    const audienceScope = AUDIENCE_SCOPES[user.role] || 'public';

    // 4. Generate Token
    const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
        audience: audienceScope
    });

    return {
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            image: user.image,
            role: user.role,
            phone: user.phone,
            address: user.address,
            city: user.city,
            country: user.country,
            createdAt: user.createdAt
        },
        token,
        redirectPath
    };
};
exports.register = async (data) => {
    // 1. Check if user exists
    const existing = await prisma.user.findUnique({
        where: { email: data.email }
    });
    if (existing) {
        throw new Error('Email already exists');
    }

    // 2. Hash Password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 3. Create User (Default Customer)
    const user = await prisma.user.create({
        data: {
            email: data.email,
            password: hashedPassword,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            role: 'CUSTOMER'
        },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true
        }
    });

    // 4. Generate Token (Auto Login)
    const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
        audience: 'public'
    });

    return {
        user,
        token,
        redirectPath: '/'
    };
};
