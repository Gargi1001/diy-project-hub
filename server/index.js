const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const projectRoutes = require('./routes/projects');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully.'))
.catch(err => console.error('MongoDB connection error:', err));

// Use routes
app.use('/api/projects', projectRoutes);
app.use('/api/upload', uploadRoutes);

// Serve static files (for uploaded images)
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Basic Test Route
app.get('/', (req, res) => {
  res.send('DIY Project Hub API is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});