import React from 'react';
// Use BrowserRouter, Routes, and Route for routing
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'; 

// Import your components
import ProjectList from './components/ProjectList';
import CreateProject from './components/CreateProject';
import ProjectDetails from './components/ProjectDetails'; // 👈 Ensure this path is correct

// --- 1. Footer Component Definition ---
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-6 mt-12">
      <div className="container mx-auto flex justify-between items-center text-sm">
        <p>&copy; {new Date().getFullYear()} DIY Project Hub. All rights reserved.</p>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-blue-400 transition duration-200">About</a>
          <a href="#" className="hover:text-blue-400 transition duration-200">Contact</a>
        </div>
      </div>
    </footer>
  );
};

// --- 2. Main App Component ---
const App = () => {
  return (
    // BrowserRouter must wrap the entire application for routing to work
    <BrowserRouter> 
      {/* min-h-screen flex flex-col ensures the footer sticks to the bottom */}
      <div className="bg-gray-50 min-h-screen flex flex-col"> 
        
        {/* Modern Gradient Navigation Header */}
        <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-extrabold tracking-wide hover:text-blue-400 transition duration-300">
              DIY <span className="text-blue-400">Hub</span>
            </Link>
            <Link 
              to="/create" 
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-full shadow-md transition transform hover:scale-105"
            >
              + New Project
            </Link>
          </div>
        </nav>
        
        {/* Main content area */}
        <main className="flex-grow container mx-auto p-4"> 
          <Routes>
            {/* Home Page Route */}
            <Route path="/" element={<ProjectList />} /> 
            
            {/* Create Project Route */}
            <Route path="/create" element={<CreateProject />} /> 
            
            {/* Project Details Route (CRITICAL) */}
            <Route path="/projects/:id" element={<ProjectDetails />} />
          </Routes>
        </main>

        <Footer /> 
      </div>
    </BrowserRouter>
  );
};

export default App;