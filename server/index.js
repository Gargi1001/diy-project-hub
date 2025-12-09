// server/index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const path = require('path');
require('dotenv').config(); 

const projectRoutes = require('./routes/projects');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 5000;

// --- 🔓 NUCLEAR CORS FIX ---
// This allows ANY frontend to talk to your backend.
// We are doing this to stop the blocking errors.
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// -------------------------

// Keep the body limit high
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true })); 

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/projects', projectRoutes);
app.use('/api/upload', uploadRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});