const authService = require('./auth.service');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const result = await authService.login(email, password);
        res.json({
            success: true,
            message: 'Login successful',
            data: result
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message || 'Login failed'
        });
    }
};

exports.register = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const name = `${firstName || ''} ${lastName || ''}`.trim() || 'New User';

        const result = await authService.register({ email, password, name });
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
