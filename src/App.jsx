import React, { useState } from 'react';
import BookingList from './components/BookingReview/BookingList';

const App = ({ shellContext, basename }) => {
  const [currentView, setCurrentView] = useState('bookings');
  
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
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Shipments Admin</h1>
        
        {/* Navigation tabs */}
        <div className="flex space-x-4 border-b mb-6">
          <button
            onClick={() => setCurrentView('bookings')}
            className={`pb-2 px-4 ${
              currentView === 'bookings' 
                ? 'border-b-2 border-purple-600 text-purple-600' 
                : 'text-gray-500'
            }`}
          >
            Booking Review
          </button>
          <button
            onClick={() => setCurrentView('shipments')}
            className={`pb-2 px-4 ${
              currentView === 'shipments' 
                ? 'border-b-2 border-purple-600 text-purple-600' 
                : 'text-gray-500'
            }`}
          >
            Shipments
          </button>
        </div>
        
        {/* Content based on current view */}
        {currentView === 'bookings' && <BookingList />}
        
        {currentView === 'shipments' && (
          <div className="p-4 border rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Shipment Management</h2>
            <p>Shipments list will load here...</p>
            <p className="text-sm text-gray-500 mt-2">Ready to add ShipmentList component</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
