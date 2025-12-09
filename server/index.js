// server/index.js (or server/server.js)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); 

const projectRoutes = require('./routes/projects'); // Assuming you have this route
const uploadRoutes = require('./routes/upload'); // <--- IMPORT THE UPLOAD ROUTE HERE

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI; 

// --- CRITICAL BODY LIMIT FIX (For Image Upload Failure) ---
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true })); 
// --------------------------------------------------------

// CORS setup (replace placeholder with your Netlify domain)
app.use(cors({
  origin: ['https://your-netlify-domain.netlify.app', 'http://localhost:5173'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// --- Database Connection ---
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));


// --- ROUTE SETUP ---
app.use('/api/projects', projectRoutes);
app.use('/api/upload', uploadRoutes); // <--- USE THE UPLOAD ROUTE HERE

// Optional: Serve files if you were using local storage
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});