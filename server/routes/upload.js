// server/routes/upload.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// 🛑 WARNING: This storage configuration saves files locally and will fail on Render/Railway.
// Replace this Multer setup with a Cloudinary configuration for a permanent deployment fix.

// Configure Multer Storage (Local Disk Storage)
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
  // CRITICAL CHECK: 'projectImage' must match the formData.append key in CreateProject.jsx
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    // Send back the path to the file (which is the local path /uploads/filename)
    res.json({
      message: 'File uploaded successfully',
      filePath: `/uploads/${req.file.filename}`
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).send(err.message);
  }
});

module.exports = router;