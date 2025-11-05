import React, { useState } from 'react';
import axios from 'axios';

// URLs for our backend API
const UPLOAD_URL = 'http://localhost:5000/api/upload';
const PROJECTS_URL = 'http://localhost:5000/api/projects';

const CreateProject = () => {
  // State for simple form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  
  // State for the image file
  const [image, setImage] = useState(null);
  
  // State for the material cost estimator
  const [materials, setMaterials] = useState([{ item: '', cost: 0, quantity: 1 }]);
  
  // State for the tutorial steps
  const [steps, setSteps] = useState(['']);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // --- Material Handlers ---
  const handleMaterialChange = (index, field, value) => {
    const newMaterials = [...materials];
    newMaterials[index][field] = value;
    setMaterials(newMaterials);
  };

  const addMaterial = () => {
    setMaterials([...materials, { item: '', cost: 0, quantity: 1 }]);
  };

  // --- Step Handlers ---
  const handleStepChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const addStep = () => {
    setSteps([...steps, '']);
  };

  // --- Main Submit Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setMessage('Please select an image.');
      return;
    }

    setLoading(true);
    setMessage('Uploading image...');

    // 1. --- Upload the Image ---
    const formData = new FormData();
    formData.append('projectImage', image); // 'projectImage' must match backend (upload.js)

    let imageUrl = '';
    try {
      const { data } = await axios.post(UPLOAD_URL, formData);
      imageUrl = data.filePath; // Get the path from the backend
      setMessage('Image uploaded. Creating project...');
    } catch (err) {
      console.error('Image upload error:', err);
      setMessage('Image upload failed. Please try again.');
      setLoading(false);
      return;
    }

    // 2. --- Create the Project ---
    try {
      const projectData = {
        title,
        description,
        difficulty,
        materials,
        steps,
        imageUrl, // Add the image path from the upload
      };

      await axios.post(PROJECTS_URL, projectData);
      
      setMessage('Project created successfully!');
      // TODO: Redirect to homepage
      setLoading(false);
      // Clear form (optional)
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error('Project creation error:', err);
      setMessage('Project creation failed.');
      setLoading(false);
    }
  };

  return (
    <form className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg my-10" onSubmit={handleSubmit}>
      <h2 className="text-3xl font-bold mb-6 text-center">Create a New DIY Project</h2>

      {/* Basic Info */}
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Project Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Difficulty</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </div>

      {/* Image Upload */}
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Project Image</label>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full"
          required
        />
      </div>

      {/* Material Cost Estimator */}
      <div className="mb-6 border p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-3">Materials (Cost Estimator)</h3>
        {materials.map((mat, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Item Name"
              value={mat.item}
              onChange={(e) => handleMaterialChange(index, 'item', e.target.value)}
              className="px-2 py-1 border rounded w-1/2"
            />
            <input
              type="number"
              placeholder="Qty"
              value={mat.quantity}
              onChange={(e) => handleMaterialChange(index, 'quantity', e.target.value)}
              className="px-2 py-1 border rounded w-1/6"
            />
            <input
              type="number"
              placeholder="Cost ($)"
              value={mat.cost}
              onChange={(e) => handleMaterialChange(index, 'cost', e.target.value)}
              className="px-2 py-1 border rounded w-1/4"
            />
          </div>
        ))}
        <button type="button" onClick={addMaterial} className="text-blue-600 font-medium">
          + Add Material
        </button>
        <div className="text-right font-bold text-lg mt-3">
          Estimated Total: $
          {materials.reduce((acc, mat) => acc + mat.cost * mat.quantity, 0).toFixed(2)}
        </div>
      </div>

      {/* Steps */}
      <div className="mb-6 border p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-3">Steps</h3>
        {steps.map((step, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <span className="text-gray-700 font-bold">{index + 1}.</span>
            <input
              type="text"
              placeholder={`Step ${index + 1}`}
              value={step}
              onChange={(e) => handleStepChange(index, e.target.value)}
              className="px-2 py-1 border rounded w-full"
            />
          </div>
        ))}
        <button type="button" onClick={addStep} className="text-blue-600 font-medium">
          + Add Step
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Creating...' : 'Create Project'}
      </button>

      {message && <p className="text-center mt-4">{message}</p>}
    </form>
  );
};

export default CreateProject;