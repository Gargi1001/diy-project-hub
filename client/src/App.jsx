import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ProjectList from './components/ProjectList';
import CreateProject from './components/CreateProject'; // Import the new component

function App() {
  return (
    <BrowserRouter>
      <div className="bg-gray-50 min-h-screen">
        
        {/* Simple Navigation Header */}
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              DIY Project Hub
            </Link>
            <Link
              to="/create"
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              + Create Project
            </Link>
          </div>
        </nav>

        {/* Page Content Area */}
        <Routes>
          <Route path="/" element={<ProjectList />} />
          <Route path="/create" element={<CreateProject />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;