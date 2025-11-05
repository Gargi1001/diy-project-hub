const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  materials: [{
    item: String,
    cost: Number,
    quantity: Number,
  }],
  steps: [{
    type: String,
  }],
  imageUrl: {
    type: String,
  },
  culturalContext: {
    type: String,
  },
}, {
  timestamps: true // Adds createdAt and updatedAt
});

module.exports = mongoose.model('Project', ProjectSchema);