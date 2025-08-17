const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');

// POST /api/upload (Single file upload)
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.status(200).json({
    message: 'File uploaded successfully',
    file: {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size
    }
  });
});

module.exports = router;
