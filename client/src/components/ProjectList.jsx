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
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col h-full"
            >
              
              {/* Image Area with Overlay Gradient */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={project.imageUrl || 'https://via.placeholder.com/400x300?text=DIY+Project'} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-bold text-gray-800 leading-tight">{project.title}</h2>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide ${getDifficultyClass(project.difficulty)}`}>
                    {project.difficulty}
                  </span>
                </div>
                
                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                  {project.description}
                </p>
                
                {/* Footer of Card */}
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center text-blue-600 font-semibold text-sm group">
                  View Details 
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectList;