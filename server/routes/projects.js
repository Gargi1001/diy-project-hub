const express = require('express');
const router = express.Router();
const Project = require('../models/Project'); // Import model

/**
 * @route   GET /api/projects
 * @desc    Get all projects
 */
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 }); // Newest first
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   POST /api/projects
 * @desc    Create a new project
 */
router.post('/', async (req, res) => {
  try {
    const { title, description, difficulty, materials, steps, imageUrl } = req.body;

    const newProject = new Project({
      title,
      description,
      difficulty,
      materials,
      steps,
      imageUrl, // We'll add this from the frontend
    });

    const project = await newProject.save(); // Save to database
    res.json(project); // Send new project back
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;