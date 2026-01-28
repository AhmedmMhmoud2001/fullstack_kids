const productService = require('./products.service');

// Helper to determine allowed scope based on user
const getScopeFilter = (user) => {
    if (!user || user.role === 'SYSTEM_ADMIN') return {}; // All access
    if (user.role === 'ADMIN_KIDS') return { audience: 'KIDS' };
    if (user.role === 'ADMIN_NEXT') return { audience: 'NEXT' };
    return {};
};

exports.create = async (req, res) => {
    try {
        const { audience } = req.body;
        const userRole = req.user.role;

        // Strict Check: Admin Kids cannot create Next products, etc.
        if (userRole === 'ADMIN_KIDS' && audience !== 'KIDS') {
            return res.status(403).json({ success: false, message: 'You can only create KIDS products' });
        }
        if (userRole === 'ADMIN_NEXT' && audience !== 'NEXT') {
            return res.status(403).json({ success: false, message: 'You can only create NEXT products' });
        }

        const product = await productService.create(req.body);
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.findAll = async (req, res) => {
    try {
        let filter = {};
        const user = req.user;

        // Role-based filtering (force audience if not system admin)
        if (user) {
            if (user.role === 'ADMIN_KIDS') filter.audience = 'KIDS';
            else if (user.role === 'ADMIN_NEXT') filter.audience = 'NEXT';
            else if (req.query.audience) filter.audience = req.query.audience; // SYSTEM_ADMIN
        } else if (req.query.audience) {
            filter.audience = req.query.audience; // Public
        }

        // Filter by bestSeller if requested
        if (req.query.bestSeller === 'true') {
            filter.isBestSeller = true;
        }

        // Filter by category slug if provided
        if (req.query.category) {
            filter.categorySlug = req.query.category;
        }

        // Additional filters
        if (req.query.minPrice) filter.minPrice = parseFloat(req.query.minPrice);
        if (req.query.maxPrice) filter.maxPrice = parseFloat(req.query.maxPrice);

        if (req.query.brands) {
            filter.brands = req.query.brands.split(',');
        }

        if (req.query.colors) {
            filter.colors = req.query.colors.split(',');
        }

        if (req.query.sortBy) {
            filter.sortBy = req.query.sortBy;
        }

        if (req.query.search) {
            filter.search = req.query.search;
        }

        const products = await productService.findAll(filter);
        res.json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.findOne = async (req, res) => {
    try {
        const product = await productService.findOne(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const userRole = req.user.role;

        // 1. Fetch existing product to check ownership
        const existing = await productService.findOne(id);
        if (!existing) return res.status(404).json({ message: 'Product not found' });

        // 2. Enforce Scope
        if (userRole === 'ADMIN_KIDS' && existing.audience !== 'KIDS') {
            return res.status(403).json({ success: false, message: 'Access denied to non-KIDS product' });
        }
        if (userRole === 'ADMIN_NEXT' && existing.audience !== 'NEXT') {
            return res.status(403).json({ success: false, message: 'Access denied to non-NEXT product' });
        }

        const product = await productService.update(id, req.body);
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        const userRole = req.user.role;

        // 1. Fetch existing product to check ownership
        const existing = await productService.findOne(id);
        if (!existing) return res.status(404).json({ message: 'Product not found' });

        // 2. Enforce Scope
        if (userRole === 'ADMIN_KIDS' && existing.audience !== 'KIDS') {
            return res.status(403).json({ success: false, message: 'Access denied to non-KIDS product' });
        }
        if (userRole === 'ADMIN_NEXT' && existing.audience !== 'NEXT') {
            return res.status(403).json({ success: false, message: 'Access denied to non-NEXT product' });
        }

        await productService.delete(id);
        res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
