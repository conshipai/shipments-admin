import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BookingList from './components/BookingReview/BookingList';
import ShipmentList from './components/ShipmentManagement/ShipmentList';
import ShipmentDetail from './components/ShipmentManagement/ShipmentDetail';

const App = ({ shellContext, basename }) => {
  // Initialize context with safe defaults
  const [context, setContext] = useState(() => {
    return shellContext || window.shellContext || {
      user: null,
      token: null,
      isDarkMode: false
    };
  });

  // Update context when shellContext prop changes or window.shellContext updates
  useEffect(() => {
    const updateContext = () => {
      const newContext = shellContext || window.shellContext || {
        user: null,
        token: null,
        isDarkMode: false
      };
      setContext(newContext);
    };

    // Listen for context updates from shell
    window.addEventListener('shell-context-updated', updateContext);
    
    // Initial update
    updateContext();

    return () => {
      window.removeEventListener('shell-context-updated', updateContext);
    };
  }, [shellContext]);

  const { user, token, isDarkMode } = context;
  
  // Check if we have required data
  if (!user || !token) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-gray-600">Loading...</h2>
        <p className="text-sm mt-2 text-gray-500">Waiting for authentication</p>
      </div>
    );
  }

  // Check permissions
  const hasAccess = ['system_admin', 'conship_employee'].includes(user?.role);
  
  if (!hasAccess) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600">Access Denied</h2>
        <p>You don't have permission to access this application.</p>
        <p className="text-sm mt-2 text-gray-500">Your role: {user?.role || 'unknown'}</p>
      </div>
    );
  }
  
  // Use the basename properly - with fallback
  const routerBasename = basename || '/app/shipments-admin';
  
  return (
    <BrowserRouter basename={routerBasename}>
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Routes>
          <Route path="/" element={<Navigate to="/bookings" replace />} />
          <Route path="/bookings" element={<BookingList />} />
          <Route path="/shipments" element={<ShipmentList />} />
          <Route path="/shipments/:id" element={<ShipmentDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

// CRITICAL: Default export for Module Federation
export default App;
