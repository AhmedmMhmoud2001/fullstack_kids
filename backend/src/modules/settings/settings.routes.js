const express = require('express');
const router = express.Router();
const settingsController = require('./settings.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/role.middleware');

// Public or Customer can get settings (like shipping fee)
router.get('/', settingsController.getAllSettings);
router.get('/:key', settingsController.getSettingByKey);

// Only System Admin can update settings
router.post('/', authenticate, authorize(['SYSTEM_ADMIN']), settingsController.updateSetting);

module.exports = router;
