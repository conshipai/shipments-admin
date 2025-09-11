import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const App = ({ shellContext, basename }) => {
  // Get context from props or window
  const context = shellContext || window.shellContext || {};
  const { user, token, isDarkMode } = context;
  
  console.log('Shipments Admin loaded with user:', user?.email, 'role:', user?.role);
  
  // Check permissions
  const hasAccess = user && ['system_admin', 'conship_employee'].includes(user?.role);
  
  if (!hasAccess) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600">Access Denied</h2>
        <p>You don't have permission to access this application.</p>
        <p className="text-sm mt-2 text-gray-500">Your role: {user?.role || 'unknown'}</p>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Routes>
        <Route path="/" element={<Navigate to="/bookings" replace />} />
        <Route path="/bookings" element={
          <div className="p-6">
            <h1 className="text-2xl font-bold">Bookings Page (Test)</h1>
            <p>If you see this, routing is working!</p>
          </div>
        } />
        <Route path="/shipments" element={
          <div className="p-6">
            <h1 className="text-2xl font-bold">Shipments Page (Test)</h1>
            <p>Shipments list will go here</p>
          </div>
        } />
        <Route path="/shipments/:id" element={
          <div className="p-6">
            <h1 className="text-2xl font-bold">Shipment Detail (Test)</h1>
            <p>Detail view will go here</p>
          </div>
        } />
      </Routes>
    </div>
  );
};

export default App;
