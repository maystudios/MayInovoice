const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Speichert Dateien im Verzeichnis 'uploads'
const { uploadController } = require('../controllers/uploadController');

router.post('/upload', upload.single('pdf'), uploadController);

module.exports = router;
