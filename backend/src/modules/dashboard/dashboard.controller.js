const dashboardService = require('./dashboard.service');

exports.getKidsStats = async (req, res) => {
    try {
        const stats = await dashboardService.getStats('KIDS');
        res.json({
            message: 'Kids Dashboard Stats',
            stats,
            user: req.user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getNextStats = async (req, res) => {
    try {
        const stats = await dashboardService.getStats('NEXT');
        res.json({
            message: 'Next Dashboard Stats',
            stats,
            user: req.user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getSystemStats = async (req, res) => {
    try {
        const stats = await dashboardService.getStats(null); // All
        res.json({
            message: 'System Dashboard Stats',
            stats,
            user: req.user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
