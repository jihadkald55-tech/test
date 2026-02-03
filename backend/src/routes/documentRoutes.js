const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const { uploadDocument, getDocuments } = require('../controllers/documentController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

router.post('/upload', auth, upload.single('file'), uploadDocument);
router.get('/:caseId', auth, getDocuments);

module.exports = router;
