import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BookingList from './components/BookingReview/BookingList';
import ShipmentList from './components/ShipmentManagement/ShipmentList';
import ShipmentDetail from './components/ShipmentManagement/ShipmentDetail';

const App = ({ shellContext, basename }) => {
  // Get context from props or window
  const context = shellContext || window.shellContext || {};
  const { user, token, isDarkMode } = context;
  
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
  
  // Use the basename properly
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
