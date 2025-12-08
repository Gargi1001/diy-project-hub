import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // <--- ⚠️ ADD THIS IMPORT!

// This is the URL of your backend server
const API_URL = 'http://localhost:5000/api/projects'; 

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(API_URL);
        setProjects(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading projects...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">DIY Project Hub</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.length === 0 ? (
          <p className="text-center col-span-full">No projects found. Go create one!</p>
        ) : (
          // Loop over the projects and display a card for each
          projects.map(project => (
            <Link 
              key={project._id} 
              to={`/projects/${project._id}`} 
              className="bg-white shadow-xl rounded-2xl overflow-hidden 
                         transform transition duration-300 
                         hover:shadow-2xl hover:scale-[1.01]" // <-- Card Styling Fix
            >
              
              {/* Image with rounded corners */}
              <img 
                src={project.imageUrl || 'placeholder.jpg'} // Use a placeholder if image is missing
                alt={project.name}
                className="w-full h-48 object-cover rounded-t-2xl" 
              />
              
              <div className="p-5">
                {/* Project Title */}
                <h2 className="text-2xl font-semibold mb-2 text-gray-900">{project.name}</h2>
                
                {/* Project Description (Truncated) */}
                <p className="text-gray-600 mb-4">{project.description ? project.description.substring(0, 100) + '...' : 'No description provided.'}</p>
                
                {/* Difficulty Badge with Color Coding */}
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${getDifficultyClass(project.difficulty)}`}>
                  {project.difficulty}
                </span>

              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectList;