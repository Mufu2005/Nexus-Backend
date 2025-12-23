const express = require('express');
const multer = require('multer');
const router = express.Router();
const { uploadDocument, getDocuments, signDocument } = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${file.originalname}`);
    },
});

const upload = multer({ storage });

router.route('/')
    .post(protect, upload.single('file'), uploadDocument)
    .get(protect, getDocuments);

router.route('/:id/sign')
    .put(protect, signDocument);

module.exports = router;