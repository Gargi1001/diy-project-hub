import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// --- NEW: Read VITE_API_URL from Netlify Environment ---
const API_BASE_URL = import.meta.env.VITE_API_URL; 
// The main list only needs the projects endpoint:
const API_URL = `${API_BASE_URL}/api/projects`;
const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- Search & Filter State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('All');

  // Helper for badge colors
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

  // --- Filtering Logic ---
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'All' || project.difficulty === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      
      {/* --- Header Section --- */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Discover DIY Projects</h1>
        <p className="text-lg text-gray-600">Explore creative ideas and build something amazing today.</p>
      </div>

      {/* --- Search and Filter Controls --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        
        {/* Search Input */}
        <div className="relative w-full md:w-1/2">
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
          {/* Search Icon SVG */}
          <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Filter Dropdown */}
        <div className="w-full md:w-auto">
          <select 
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="w-full md:w-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer bg-white"
          >
            <option value="All">All Levels</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* --- Projects Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <p className="text-xl text-gray-500">No projects found matching your search.</p>
            <button 
              onClick={() => {setSearchTerm(''); setFilterDifficulty('All');}}
              className="mt-4 text-blue-600 hover:underline font-semibold"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          filteredProjects.map(project => (
            <Link 
              key={project._id} 
              to={`/projects/${project._id}`} 
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col h-full group"
            >
              
              {/* Image Area */}
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={project.imageUrl || 'https://via.placeholder.com/400x300?text=DIY+Project'} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-bold text-gray-800 leading-tight group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h2>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide ${getDifficultyClass(project.difficulty)}`}>
                    {project.difficulty}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                  {project.description}
                </p>
                
                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">View Tutorial</span>
                  <span className="text-blue-600 transform group-hover:translate-x-1 transition-transform">→</span>
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