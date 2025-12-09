import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

// URLs for our backend API (Remember to update to live URLs for deployment!)
// IMPORTANT: For deployment, replace 'http://localhost:5000' with your Railway backend URL
const UPLOAD_URL = 'https://diy-project-hub-production.up.railway.app/api/upload';
const PROJECTS_URL = 'https://diy-project-hub-production.up.railway.app/api/projects';

const CreateProject = () => {
  const navigate = useNavigate(); 

  // State for simple form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [image, setImage] = useState(null);

  // State for the material cost estimator
  const [materials, setMaterials] = useState([{ item: '', cost: 0, quantity: 1 }]);
  // State for the tutorial steps
  const [steps, setSteps] = useState(['']);

  // STATE FOR SUBMISSION FEEDBACK
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [message, setMessage] = useState(''); 

  // --- Material Handlers ---
  const handleMaterialChange = (index, field, value) => {
    const newMaterials = [...materials];
    
    if (field === 'cost') {
        newMaterials[index].cost = parseFloat(value) || 0;
    } else if (field === 'quantity') {
        newMaterials[index].quantity = parseInt(value) || 1;
    } else {
        newMaterials[index][field] = value;
    }
    
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

  // CORRECTED handleSubmit FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!image) {
      setMessage('Please select an image.');
      return;
    }
    
    setIsSubmitting(true);
    setMessage('Uploading image...');

    let imageUrl = '';
    const formData = new FormData();
    formData.append('projectImage', image);

    // 1. Upload the Image
    try {
      const { data } = await axios.post(UPLOAD_URL, formData);
      imageUrl = data.filePath;
      setMessage('Image uploaded. Creating project...');
    } catch (err) {
      console.error('Image upload error:', err);
      setMessage('Image upload failed. Please try again.');
      setIsSubmitting(false);
      setTimeout(() => setMessage(''), 5000); 
      return;
    }

    // 2. Create the Project
    try {
      const projectData = {
        title,
        description,
        difficulty,
        materials,
        steps,
        imageUrl,
      };

      await axios.post(PROJECTS_URL, projectData); 
      
      setMessage('Project created successfully! Redirecting...');
      
      setTitle('');
      setDescription('');
      setMaterials([{ item: '', cost: 0, quantity: 1 }]);
      setSteps(['']);
      
      setTimeout(() => navigate('/'), 1500); 

    } catch (err) {
      console.error('Project creation error:', err);
      setMessage('Project creation failed.');
      setTimeout(() => setMessage(''), 5000); 
    } finally {
      if (!message.includes('successfully')) { 
          setIsSubmitting(false); 
      }
    }
  };

  // JSX Structure
  return (
    <form className="max-w-3xl mx-auto p-8 bg-white shadow-xl rounded-xl my-10" onSubmit={handleSubmit}>
      <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">Share Your DIY Project</h2>

      {/* --- Basic Info Fields --- */}
      <div className="bg-slate-50 min-h-screen flex flex-col font-sans">
          
        {/* Title */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Project Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            required
          />
        </div>

        {/* Difficulty */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>
      </div>
      
      {/* Description */}
      <div className="mb-6">
        <label className="block text-gray-700 font-bold mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none h-32 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          required
        />
      </div>

      {/* Image Upload */}
      <div className="mb-6">
        <label className="block text-gray-700 font-bold mb-2">Project Image</label>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          required
        />
      </div>

      {/* Material Cost Estimator */}
      <div className="mb-6 border border-gray-200 p-5 rounded-lg">
        <h3 className="text-xl font-bold mb-3 text-gray-800">Materials (Cost Estimator)</h3>
        {materials.map((mat, index) => (
          <div key={index} className="flex gap-3 mb-3 items-center">
            <input
              type="text"
              placeholder="Item Name"
              value={mat.item}
              onChange={(e) => handleMaterialChange(index, 'item', e.target.value)}
              className="px-3 py-2 border rounded-lg w-1/2"
            />
            <input
              type="number"
              placeholder="Qty"
              value={mat.quantity}
              onChange={(e) => handleMaterialChange(index, 'quantity', e.target.value)}
              className="px-3 py-2 border rounded-lg w-1/6 text-center"
              min="1"
            />
            <input
              type="number"
              placeholder="Cost ($)"
              value={mat.cost}
              onChange={(e) => handleMaterialChange(index, 'cost', e.target.value)}
              className="px-3 py-2 border rounded-lg w-1/4"
              min="0"
            />
          </div>
        ))}
        <button type="button" onClick={addMaterial} className="text-blue-600 font-semibold hover:text-blue-800 transition duration-150 mt-2">
          + Add Material
        </button>
        <div className="text-right font-extrabold text-xl mt-4 pt-3 border-t border-gray-200">
          Estimated Total: ${materials.reduce((acc, mat) => acc + (mat.cost * mat.quantity), 0).toFixed(2)}
        </div>
      </div>

      {/* Steps */}
      <div className="mb-6 border border-gray-200 p-5 rounded-lg">
        <h3 className="text-xl font-bold mb-3 text-gray-800">Steps</h3>
        {steps.map((step, index) => (
          <div key={index} className="flex gap-3 mb-3 items-start">
            <span className="text-gray-700 font-bold text-lg pt-2">{index + 1}.</span>
            <textarea
              placeholder={`Describe Step ${index + 1}`}
              value={step}
              rows="3"
              onChange={(e) => handleStepChange(index, e.target.value)}
              className="px-3 py-2 border rounded-lg w-full resize-none focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            />
          </div>
        ))}
        <button type="button" onClick={addStep} className="text-blue-600 font-semibold hover:text-blue-800 transition duration-150 mt-2">
          + Add Step
        </button>
      </div>
      
      {/* --- Message Display --- */}
      {message && (
        <p className={`text-center py-3 rounded-lg font-medium mb-4 transition duration-300 ${
          message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </p>
      )}

      {/* --- Submit Button --- */}
      <button
        type="submit"
        disabled={isSubmitting} 
        className={`w-full font-extrabold py-3 px-4 rounded-lg transition duration-300 shadow-md 
          ${isSubmitting 
            ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
            : 'bg-blue-600 text-white hover:bg-blue-700'
          }`
        }
      >
        {isSubmitting ? 'Processing...' : 'Create Project'} 
      </button>

    </form>
  );
};

export default CreateProject;