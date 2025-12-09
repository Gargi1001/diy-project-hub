import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ProjectList from './components/ProjectList';
import CreateProject from './components/CreateProject';
import ProjectDetails from './components/ProjectDetails';
// import EditProject from './components/EditProject'; // Uncomment if you have created this file

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

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
        
        {/* Navigation Header */}
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-gray-800">
              DIY Project Hub
            </Link>
            <Link 
              to="/create" 
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              + Create Project
            </Link>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-grow container mx-auto p-4">
          <Routes>
            <Route path="/" element={<ProjectList />} />
            <Route path="/create" element={<CreateProject />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            {/* <Route path="/projects/:id/edit" element={<EditProject />} /> */}
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;