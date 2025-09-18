// src/components/ShipmentManagement/ActiveShipments.jsx
import React, { useState, useEffect } from 'react';
import { 
  Truck, Package, MapPin, Calendar, Clock, 
  FileText, Plus, Eye, Edit, AlertCircle 
} from 'lucide-react';
import api from '../../services/api';
import ShipmentDetailModal from './ShipmentDetailModal';
import MilestoneModal from './MilestoneModal';

const ActiveShipments = ({ user, canEdit, isDarkMode, onUpdate }) => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  
  useEffect(() => {
    fetchShipments();
  }, []);
  
  const fetchShipments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/shipments');
      const allShipments = response.data.shipments || [];
      // Filter for active shipments
      const active = allShipments.filter(s => 
        !['DELIVERED', 'COMPLETED', 'CANCELLED'].includes(s.status)
      );
      setShipments(active);
    } catch (error) {
      console.error('Error fetching shipments:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewDetails = (shipment) => {
    setSelectedShipment(shipment);
    setShowDetailModal(true);
  };
  
  const handleAddMilestone = (shipment) => {
    setSelectedShipment(shipment);
    setShowMilestoneModal(true);
  };
  
  const getStatusColor = (status) => {
    const colors = {
      'CREATED': 'bg-gray-100 text-gray-800',
      'DISPATCHED': 'bg-blue-100 text-blue-800',
      'ONSITE': 'bg-yellow-100 text-yellow-800',
      'LOADING': 'bg-orange-100 text-orange-800',
      'IN_TRANSIT': 'bg-purple-100 text-purple-800',
      'AT_DESTINATION': 'bg-indigo-100 text-indigo-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Clock className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }
  
  if (shipments.length === 0) {
    return (
      <div className="text-center py-12">
        <Truck className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium">No active shipments</h3>
        <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          All shipments have been delivered or completed
        </p>
      </div>
    );
  }
  
  return (
    <>
      <div className="space-y-4">
        {shipments.map(shipment => (
          <div 
            key={shipment._id}
            className={`rounded-lg border p-6 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}
          >
            {/* Shipment Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">
                    {shipment.shipmentNumber || `SHP-${shipment._id.slice(-6)}`}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(shipment.status)}`}>
                    {shipment.status}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Carrier: {shipment.carrier?.name || 'Not Assigned'}
                  {shipment.carrier?.proNumber && ` • PRO: ${shipment.carrier.proNumber}`}
                </p>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewDetails(shipment)}
                  className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                
                {canEdit && (
                  <button
                    onClick={() => handleAddMilestone(shipment)}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Milestone
                  </button>
                )}
              </div>
            </div>
            
            {/* Shipment Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Origin */}
              <div className={`p-3 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span className="font-medium text-sm">Origin</span>
                </div>
                <p className="text-sm">{shipment.origin?.company}</p>
                <p className="text-sm">
                  {shipment.origin?.city}, {shipment.origin?.state} {shipment.origin?.zip}
                </p>
              </div>
              
              {/* Destination */}
              <div className={`p-3 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-green-500" />
                  <span className="font-medium text-sm">Destination</span>
                </div>
                <p className="text-sm">{shipment.destination?.company}</p>
                <p className="text-sm">
                  {shipment.destination?.city}, {shipment.destination?.state} {shipment.destination?.zip}
                </p>
              </div>
              
              {/* Dates */}
              <div className={`p-3 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span className="font-medium text-sm">Schedule</span>
                </div>
                <p className="text-sm">
                  Pickup: {shipment.scheduledPickup ? new Date(shipment.scheduledPickup).toLocaleDateString() : 'TBD'}
                </p>
                <p className="text-sm">
                  Delivery: {shipment.scheduledDelivery ? new Date(shipment.scheduledDelivery).toLocaleDateString() : 'TBD'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Detail Modal */}
      {showDetailModal && selectedShipment && (
        <ShipmentDetailModal
          shipment={selectedShipment}
          canEdit={canEdit}
          isDarkMode={isDarkMode}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedShipment(null);
            fetchShipments();
          }}
        />
      )}
      
      {/* Milestone Modal */}
      {showMilestoneModal && selectedShipment && (
        <MilestoneModal
          shipment={selectedShipment}
          isDarkMode={isDarkMode}
          onClose={() => {
            setShowMilestoneModal(false);
            setSelectedShipment(null);
            fetchShipments();
            onUpdate();
          }}
        />
      )}
    </>
  );
};

export default ActiveShipments;
