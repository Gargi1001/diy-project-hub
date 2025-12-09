// server/routes/upload.js (The FULL Cloudinary Setup)
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const router = express.Router();
require('dotenv').config(); 

// --- 🔑 Configure Cloudinary with Render Environment Variables ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// --- ☁️ Configure Cloudinary Storage for Multer ---
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'diy-project-hub-uploads', // Customize the folder name here
    allowed_formats: ['jpeg', 'jpg', 'png', 'gif'],
  },
});

// Initialize Multer with Cloudinary Storage
// The upload object will now handle streaming the file directly to Cloudinary
const upload = multer({ storage: storage });

// --- Upload Endpoint ---
// CRITICAL: 'projectImage' must match the formData.append key in CreateProject.jsx
router.post('/', upload.single('projectImage'), (req, res) => {
  try {
    if (!req.file) {
      // This happens if Multer couldn't process the file (e.g., bad format or size limit)
      return res.status(400).send('No file uploaded or file filter failed.');
    }
    
    // Cloudinary automatically provides the public URL at req.file.path
    res.status(200).json({
      message: 'File uploaded successfully to Cloudinary',
      filePath: req.file.path // <-- This is the permanent, public image URL
    });

  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    res.status(500).send(err.message || 'Cloudinary upload failed.');
  }
});

module.exports = router;