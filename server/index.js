// server/index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // <--- Make sure this is imported
const path = require('path');
require('dotenv').config(); 

const projectRoutes = require('./routes/projects');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 5000;

// --- CRITICAL CORS FIX ---
// We explicitly allow your Netlify URL here
app.use(cors({
  origin: [
    'https://starlit-cookies-395f15.netlify.app', // Your Live Frontend
    'http://localhost:5173'                         // Your Local Frontend
  ],
  credentials: true
}));
// -------------------------

// Increase body limit for images
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true })); 

// ... rest of your database connection and routes ...
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/projects', projectRoutes);
app.use('/api/upload', uploadRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});