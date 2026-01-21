const express = require('express');
const router = express.Router();
const upload = require('../../middlewares/upload.middleware');
const { authenticate } = require('../../middlewares/auth.middleware');

router.post('/', authenticate, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        // Return the URL path to access the file
        // Assuming the app serves 'uploads' folder at '/uploads' or similar
        // We will configure app.js to serve '/uploads' route to the uploads folder

        // Construct standard URL. In production this might be a CDN URL.
        // For local development, we return a relative path or full URL.
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        res.json({
            success: true,
            data: {
                url: fileUrl,
                filename: req.file.filename
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
