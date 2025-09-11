import React, { useState } from 'react';
import BookingList from './components/BookingReview/BookingList';
import ShipmentList from './components/ShipmentManagement/ShipmentList';
import ShipmentDetail from './components/ShipmentManagement/ShipmentDetail';

const App = ({ shellContext, basename }) => {
  const [currentView, setCurrentView] = useState('bookings');
  const [selectedShipmentId, setSelectedShipmentId] = useState(null);
  
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
  
  // Handle navigation to shipment detail
  const handleViewShipment = (shipmentId) => {
    setSelectedShipmentId(shipmentId);
    setCurrentView('shipment-detail');
  };
  
  // Handle back navigation
  const handleBack = () => {
    setSelectedShipmentId(null);
    setCurrentView('shipments');
  };
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Shipments Admin</h1>
        
        {/* Navigation tabs - hide when viewing detail */}
        {currentView !== 'shipment-detail' && (
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
        )}
        
        {/* Content based on current view */}
        {currentView === 'bookings' && <BookingList />}
        
        {currentView === 'shipments' && (
          <ShipmentList onViewShipment={handleViewShipment} />
        )}
        
        {currentView === 'shipment-detail' && selectedShipmentId && (
          <ShipmentDetail 
            shipmentId={selectedShipmentId} 
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
};

export default App;
