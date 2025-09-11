// src/components/ShipmentManagement/ShipmentDetail.jsx
import React, { useState, useEffect } from 'react';
import { 
  Truck, Package, MapPin, Calendar, Clock, 
  User, Phone, Mail, DollarSign, FileText,
  CheckCircle, AlertCircle, ArrowLeft
} from 'lucide-react';
import api from '../../services/api';

const ShipmentDetail = ({ shipmentId, onBack }) => {  // Changed to accept props
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  
  const shellContext = window.shellContext || {};
  const { token, isDarkMode } = shellContext;

  const milestoneTypes = [
    'DISPATCHED', 'ONSITE', 'LOADING', 'IN_TRANSIT', 
    'AT_DESTINATION', 'DELIVERED', 'COMPLETED'
  ];

  useEffect(() => {
    if (shipmentId) {
      fetchShipmentDetail();
    }
  }, [shipmentId]);

  const fetchShipmentDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/shipments/${shipmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShipment(response.data.shipment);
    } catch (error) {
      console.error('Error fetching shipment:', error);
      alert('Error loading shipment details');
      onBack();  // Go back on error
    } finally {
      setLoading(false);
    }
  };

  const handleAddMilestone = async (type, location, notes) => {
    try {
      const response = await api.post(
        `/shipments/${shipmentId}/milestone`,
        { type, location, notes },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      if (response.data.success) {
        setShipment(response.data.shipment);
        setShowMilestoneModal(false);
        alert('Milestone added successfully');
      }
    } catch (error) {
      alert('Error adding milestone: ' + error.message);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading shipment details...</div>;
  }

  if (!shipment) {
    return <div className="p-6 text-center">Shipment not found</div>;
  }

  return (
    <div className={isDarkMode ? 'text-white' : ''}>
      {/* Header with back button */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-2 text-purple-600 hover:text-purple-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shipments
          </button>
          <h2 className="text-2xl font-bold">{shipment.shipmentNumber}</h2>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Created: {new Date(shipment.createdAt).toLocaleDateString()}</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
              {shipment.status}
            </span>
          </div>
        </div>
      </div>

      {/* Rest of the component remains the same... */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Locations */}
          <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200'}`}>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" /> Locations
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Origin</div>
                <div className="font-medium">{shipment.origin?.company}</div>
                <div className="text-sm">
                  {shipment.origin?.city}, {shipment.origin?.state} {shipment.origin?.zip}
                </div>
                <div className="text-sm">{shipment.origin?.contact}</div>
                <div className="text-sm">{shipment.origin?.phone}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Destination</div>
                <div className="font-medium">{shipment.destination?.company}</div>
                <div className="text-sm">
                  {shipment.destination?.city}, {shipment.destination?.state} {shipment.destination?.zip}
                </div>
                <div className="text-sm">{shipment.destination?.contact}</div>
                <div className="text-sm">{shipment.destination?.phone}</div>
              </div>
            </div>
          </div>

          {/* Continue with the rest of the original component... */}
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetail;
