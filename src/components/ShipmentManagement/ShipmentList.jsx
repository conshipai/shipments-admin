// src/components/ShipmentManagement/ShipmentList.jsx
import React, { useState, useEffect } from 'react';
import { Truck, Package, MapPin, Calendar, DollarSign } from 'lucide-react';
import api from '../../services/api';

const ShipmentList = ({ onViewShipment }) => {  // Added onViewShipment prop
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const shellContext = window.shellContext || {};
  const { token, isDarkMode } = shellContext;

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/shipments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShipments(response.data.shipments || []);
    } catch (error) {
      console.error('Error fetching shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'CREATED': 'bg-gray-100 text-gray-800',
      'DISPATCHED': 'bg-blue-100 text-blue-800',
      'ONSITE': 'bg-yellow-100 text-yellow-800',
      'LOADING': 'bg-orange-100 text-orange-800',
      'IN_TRANSIT': 'bg-purple-100 text-purple-800',
      'AT_DESTINATION': 'bg-indigo-100 text-indigo-800',
      'DELIVERED': 'bg-green-100 text-green-800',
      'COMPLETED': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={isDarkMode ? 'text-white' : ''}>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">Active Shipments</h2>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading shipments...</div>
      ) : (
        <div className="grid gap-4">
          {shipments.map(shipment => (
            <div 
              key={shipment._id}
              onClick={() => onViewShipment(shipment._id)}  // Changed from navigate
              className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${
                isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <Truck className="w-6 h-6 text-purple-600" />
                  <div>
                    <div className="font-semibold">{shipment.shipmentNumber}</div>
                    <div className="text-sm text-gray-500">
                      Customer: {shipment.customerId?.name || 'Unknown'}
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(shipment.status)}`}>
                  {shipment.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{shipment.origin?.city}, {shipment.origin?.state}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{shipment.destination?.city}, {shipment.destination?.state}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{shipment.scheduledPickup ? new Date(shipment.scheduledPickup).toLocaleDateString() : 'TBD'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span>{shipment.cargo?.weight} lbs</span>
                </div>
              </div>

              {shipment.carrier?.name && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <span className="text-sm text-gray-500">Carrier: </span>
                  <span className="text-sm font-medium">{shipment.carrier.name}</span>
                </div>
              )}
            </div>
          ))}
          
          {shipments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No active shipments
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShipmentList;
