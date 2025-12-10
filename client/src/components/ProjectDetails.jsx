import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

// --- NEW: Read VITE_API_URL from Netlify Environment ---
// This ensures we connect to the live Render backend
const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE_URL}/api/projects`;
// --------------------------------------------------------

const ProjectDetails = () => {
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Get the ID from the URL parameter (e.g., /project/657...)
    const { id } = useParams();
    const navigate = useNavigate();

    // --- Fetch Project Data ---
    useEffect(() => {
        const fetchProject = async () => {
            try {
                // Fetch request to the single project endpoint: /api/projects/:id
                const response = await axios.get(`${API_URL}/${id}`);
                setProject(response.data);
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching project:", err);
                setError("Project not found or failed to load data.");
                setIsLoading(false);
            }
        };

        if (id) {
            fetchProject();
        }
    }, [id]);

    // --- Delete Project Functionality ---
    const handleDelete = async () => {
        if (window.confirm('Are you absolutely sure you want to permanently delete this project?')) {
            try {
                // Send DELETE request to your Render backend
                await axios.delete(`${API_URL}/${id}`); 
                
                alert('Project deleted successfully!');
                // Redirect user back to the home page after deletion
                navigate('/'); 
            } catch (error) {
                console.error('Failed to delete project:', error);
                alert('Failed to delete project. Check the console for errors.');
            }
        }
    };

    if (isLoading) {
        return <div className="text-center mt-20 text-xl font-semibold">Loading Project Details...</div>;
    }

    if (error) {
        return <div className="text-center mt-20 text-xl font-bold text-red-600">{error}</div>;
    }

    if (!project) {
        return <div className="text-center mt-20 text-xl font-bold text-red-600">Project data is missing.</div>;
    }

    const totalCost = project.materials.reduce((acc, mat) => acc + (mat.cost * mat.quantity), 0).toFixed(2);

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white shadow-2xl rounded-xl my-10">
            {/* Header: Title and Delete Button */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-4xl font-extrabold text-gray-900">{project.title}</h1>
                <div className="flex space-x-4">
                    <Link to="/" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200 shadow-md">
                        &larr; Back to Home
                    </Link>
                    <button 
                        onClick={handleDelete}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-200 shadow-md"
                    >
                        Delete Project
                    </button>
                </div>
            </div>

            {/* Image and Difficulty */}
            <div className="md:flex md:space-x-8 mb-8">
                <div className="md:w-1/2">
                    <img 
                        src={project.imageUrl} 
                        alt={project.title} 
                        className="w-full h-auto object-cover rounded-lg shadow-lg"
                    />
                </div>
                <div className="md:w-1/2 mt-6 md:mt-0">
                    <p className="text-lg mb-4">
                        <span className="font-bold text-gray-700">Difficulty:</span> {project.difficulty}
                    </p>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Project Overview</h2>
                    <p className="text-gray-600 leading-relaxed">
                        {project.description}
                    </p>
                </div>
            </div>

            {/* Materials Section */}
            <div className="mb-8 border p-5 rounded-lg bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Materials Required</h2>
                <ul className="space-y-2">
                    {project.materials.map((mat, index) => (
                        <li key={index} className="flex justify-between items-center text-gray-700 border-b pb-2 last:border-b-0">
                            <span className="font-medium">{mat.item} ({mat.quantity} unit{mat.quantity > 1 ? 's' : ''})</span>
                            <span className="font-semibold text-green-700">${(mat.cost * mat.quantity).toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
                <div className="text-right mt-4 pt-3 border-t-2 border-gray-300">
                    <span className="text-xl font-extrabold text-gray-900">Estimated Total Cost: ${totalCost}</span>
                </div>
            </div>

            {/* Steps Section */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Step-by-Step Tutorial</h2>
                <ol className="list-decimal list-inside space-y-4 text-gray-700">
                    {project.steps.map((step, index) => (
                        <li key={index} className="pl-2">
                            <span className="font-semibold">Step {index + 1}:</span> {step}
                        </li>
                    ))}
                </ol>
            </div>
            
            <div className="text-center mt-10 pt-5 border-t">
                <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium transition duration-150">
                    &larr; Back to All Projects
                </Link>
            </div>
        </div>
    );
};


export default ProjectDetails;