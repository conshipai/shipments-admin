// src/components/ShipmentManagement/CompletedShipments.jsx
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, Package, MapPin, Calendar, 
  FileText, Download, Eye 
} from 'lucide-react';
import api from '../../services/api';

const CompletedShipments = ({ user, canEdit, isDarkMode }) => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchCompletedShipments();
  }, []);
  
  const fetchCompletedShipments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/shipments');
      const allShipments = response.data.shipments || [];
      const completed = allShipments.filter(s => 
        ['DELIVERED', 'COMPLETED'].includes(s.status)
      );
      setShipments(completed);
    } catch (error) {
      console.error('Error fetching shipments:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  if (shipments.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium">No completed shipments</h3>
        <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Completed shipments will appear here
        </p>
      </div>
    );
  }
  
  return (
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
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                {shipment.shipmentNumber}
              </h3>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Completed: {new Date(shipment.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              {shipment.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompletedShipments;
