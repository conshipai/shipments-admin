import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BookingList from './components/BookingReview/BookingList';
import ShipmentList from './components/ShipmentManagement/ShipmentList';
import ShipmentDetail from './components/ShipmentManagement/ShipmentDetail';

const App = ({ shellContext, basename }) => {
  const { user, token, isDarkMode } = shellContext || window.shellContext || {};
  
  // Check permissions
  const hasAccess = ['system_admin', 'conship_employee'].includes(user?.role);
  
  if (!hasAccess) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600">Access Denied</h2>
        <p>You don't have permission to access this application.</p>
      </div>
    );
  }
  
  return (
    <BrowserRouter basename={basename}>
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

export default App;
