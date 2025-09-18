// src/components/ShipmentManagement/ShipmentDetailModal.jsx
import React from 'react';
import { X, Truck, Package, MapPin, Calendar, FileText, Clock } from 'lucide-react';

const ShipmentDetailModal = ({ shipment, canEdit, isDarkMode, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className={`sticky top-0 px-6 py-4 border-b ${
          isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{shipment.shipmentNumber}</h2>
            <button onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {/* Add full shipment details here */}
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Shipment Details</h3>
              <pre>{JSON.stringify(shipment, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetailModal;
