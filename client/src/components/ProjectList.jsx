import React, { useState, useEffect } from 'react';
import axios from 'axios';

// This is the URL of your backend server
const API_URL = 'http://localhost:5000/api/projects';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // This code runs once when the component loads
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // 1. Make a GET request to our backend
        const response = await axios.get(API_URL);
        // 2. Save the projects from the database into our state
        setProjects(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setLoading(false);
      }
    };

    fetchProjects(); // Call the function
  }, []); // The empty [] means "run this only once"

  if (loading) {
    return <div className="text-center p-8">Loading projects...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">DIY Projects</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {projects.length === 0 ? (
          <p>No projects found. Go create one!</p>
        ) : (
          // Loop over the projects and display a card for each
          projects.map(project => (
            <div key={project._id} className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-2">{project.title}</h2>
              <p className="text-gray-700 mb-4">{project.description}</p>
              <span className="text-sm font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {project.difficulty}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectList;