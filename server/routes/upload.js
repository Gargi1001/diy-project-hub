const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to 'uploads'
  },
  filename: (req, file, cb) => {
    // Create a unique filename
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// File Filter
const checkFileType = (file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
};

// Initialize Multer
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
});

// Upload Endpoint
router.post('/', upload.single('projectImage'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    // Send back the path to the file
    res.json({
      message: 'File uploaded successfully',
      filePath: `/uploads/${req.file.filename}`
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;