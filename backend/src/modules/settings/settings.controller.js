const settingsService = require('./settings.service');

exports.getAllSettings = async (req, res) => {
    try {
        const settings = await settingsService.getAllSettings();
        res.json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getSettingByKey = async (req, res) => {
    try {
        const { key } = req.params;
        const setting = await settingsService.getSetting(key);
        res.json({ success: true, data: setting });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateSetting = async (req, res) => {
    try {
        const { key, value } = req.body;
        if (!key) return res.status(400).json({ message: 'Key is required' });

        const setting = await settingsService.upsertSetting(key, value);
        res.json({ success: true, data: setting });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
