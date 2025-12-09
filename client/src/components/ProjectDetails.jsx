import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Import Link for the Edit button

// IMPORTANT: Ensure this API URL points to your live backend
const API_URL = 'https://diy-project-hub-production.up.railway.app/api/projects'; 

// --- Helper Function for Difficulty Badge Colors ---
const getDifficultyClass = (difficulty) => {
    switch (difficulty) {
        case 'Easy':
            return 'bg-green-100 text-green-700 border border-green-200';
        case 'Medium':
            return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
        case 'Hard':
            return 'bg-red-100 text-red-700 border border-red-200';
        default:
            return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
};

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Data Fetching ---
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

  // --- DELETE Handler ---
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        navigate('/'); // Redirect to the homepage
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project. Check the console for details.');
      }
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-xl">Loading project details...</p>;
  }
  
  if (!project) {
    return <p className="text-center mt-10 text-xl text-red-600">Project not found.</p>;
  }

  const totalCost = project.materials ? project.materials.reduce((acc, mat) => acc + mat.cost * mat.quantity, 0) : 0;

  return (
    <div className="container mx-auto p-6 my-10 bg-white rounded-xl shadow-2xl">
      
      {/* --- TITLE and ACTION Buttons --- */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-5xl font-extrabold text-gray-900">{project.title}</h1>
          
          <div className="flex gap-4"> 
              {/* EDIT BUTTON (for the next step) */}
              <Link 
                  to={`/projects/${project._id}/edit`}
                  className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md transform hover:scale-[1.02]"
              >
                  Edit Project
              </Link>
              
              {/* DELETE BUTTON */}
              <button 
                  onClick={handleDelete}
                  className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition duration-300 shadow-md transform hover:scale-[1.02]"
              >
                  Delete Project
              </button>
          </div>
      </div>

      <span className={`text-lg font-semibold px-4 py-1 rounded-full ${getDifficultyClass(project.difficulty)}`}>
        {project.difficulty}
      </span>
      
      <p className="text-xl text-gray-600 mt-6 mb-8">{project.description}</p>

      {/* --- TWO COLUMN LAYOUT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* COLUMN 1: IMAGE AND STEPS (2/3 width) */}
        <div className="lg:col-span-2">
          <img 
            src={project.imageUrl || 'https://via.placeholder.com/800x600?text=DIY+Project'} 
            alt={project.title} 
            className="w-full h-auto max-h-[600px] object-cover rounded-lg shadow-lg mb-10"
          />

          {/* PROJECT STEPS */}
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">How to Build It</h2>
          <ol className="space-y-6">
            {project.steps && project.steps.map((step, index) => (
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
          <div className="bg-green-600 text-white p-6 rounded-xl shadow-xl transform transition duration-300 hover:scale-[1.02]">
            <p className="text-xl font-medium mb-1">Estimated Total Cost</p>
            <p className="text-6xl font-extrabold">${totalCost.toFixed(2)}</p>
          </div>

          {/* MATERIALS LIST */}
          <div className="bg-gray-100 p-6 rounded-xl shadow-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Materials Needed</h3>
            <ul className="space-y-3">
              {project.materials && project.materials.map((mat, index) => (
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