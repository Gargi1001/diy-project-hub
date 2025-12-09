import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// Utility function copied from ProjectList.jsx for consistent color coding
const getDifficultyClass = (difficulty) => {
    switch (difficulty) {
        case 'Easy':
            return 'bg-green-100 text-green-800';
        case 'Medium':
            return 'bg-yellow-100 text-yellow-800';
        case 'Hard':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

// IMPORTANT: Ensure this API URL points to your live backend (e.g., your Railway URL)
const API_URL = 'http://localhost:5000/api/projects'; 

const ProjectDetails = () => {
  const { id } = useParams(); // Get the project ID from the URL
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch project data when the component loads
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`${API_URL}/${id}`);
        setProject(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching project:', error);
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-10 text-xl">Loading project details...</p>;
  }
  
  if (!project) {
    return <p className="text-center mt-10 text-xl text-red-600">Project not found.</p>;
  }

  // Calculate total cost (Crucial for the highlight box)
  const totalCost = project.materials.reduce((acc, mat) => acc + mat.cost * mat.quantity, 0);

  return (
    <div className="container mx-auto p-6 my-10 bg-white rounded-xl shadow-2xl">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-4">{project.title}</h1>
      
      {/* Difficulty Badge */}
      <span className={`text-lg font-semibold px-4 py-1 rounded-full ${getDifficultyClass(project.difficulty)}`}>
        {project.difficulty}
      </span>
      
      <p className="text-xl text-gray-600 mt-6 mb-8">{project.description}</p>

      {/* --- TWO COLUMN LAYOUT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* COLUMN 1: IMAGE AND STEPS (2/3 width) */}
        <div className="lg:col-span-2">
          <img 
            src={project.imageUrl || 'placeholder.jpg'} 
            alt={project.title} 
            className="w-full h-auto max-h-[600px] object-cover rounded-lg shadow-lg mb-10"
          />

          {/* PROJECT STEPS */}
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">How to Build It</h2>
          <ol className="space-y-6">
            {project.steps.map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center 
                               bg-blue-600 text-white rounded-full font-extrabold text-lg mr-4">
                  {index + 1}
                </span>
                <p className="text-lg text-gray-700 pt-0.5">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* COLUMN 2: MATERIALS AND COST (1/3 width) */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* --- COST ESTIMATOR HIGHLIGHT --- */}
          <div className="bg-green-500 text-white p-6 rounded-xl shadow-xl transform transition duration-300 hover:scale-[1.02]">
            <p className="text-xl font-medium mb-1">Estimated Total Cost</p>
            <p className="text-6xl font-extrabold">${totalCost.toFixed(2)}</p>
          </div>

          {/* MATERIALS LIST */}
          <div className="bg-gray-100 p-6 rounded-xl shadow-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Materials Needed</h3>
            <ul className="space-y-3">
              {project.materials.map((mat, index) => (
                <li key={index} className="flex justify-between text-gray-700 text-lg border-b border-gray-300 pb-2">
                  <span>{mat.item} ({mat.quantity}x)</span>
                  <span className="font-semibold">${(mat.cost * mat.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;