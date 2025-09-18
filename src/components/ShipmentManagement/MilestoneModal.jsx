// src/components/ShipmentManagement/MilestoneModal.jsx
import React, { useState } from 'react';
import { X, MapPin, Clock } from 'lucide-react';
import api from '../../services/api';

const MilestoneModal = ({ shipment, isDarkMode, onClose }) => {
  const [milestone, setMilestone] = useState({
    type: '',
    location: '',
    notes: '',
    timestamp: new Date().toISOString().slice(0, 16)
  });
  
  const milestoneTypes = [
    'DISPATCHED',
    'ONSITE', 
    'LOADING',
    'IN_TRANSIT',
    'AT_DESTINATION',
    'DELIVERED',
    'COMPLETED'
  ];
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await api.post(`/shipments/${shipment._id}/milestone`, milestone);
      alert('Milestone added successfully');
      onClose();
    } catch (error) {
      alert('Error adding milestone: ' + error.message);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-md rounded-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className={`px-6 py-4 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Add Milestone</h2>
            <button onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Milestone Type *
            </label>
            <select
              value={milestone.type}
              onChange={(e) => setMilestone({...milestone, type: e.target.value})}
              required
              className={`w-full px-3 py-2 rounded border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
            >
              <option value="">Select Type</option>
              {milestoneTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Location
            </label>
            <input
              type="text"
              value={milestone.location}
              onChange={(e) => setMilestone({...milestone, location: e.target.value})}
              placeholder="City, State"
              className={`w-full px-3 py-2 rounded border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Date/Time
            </label>
            <input
              type="datetime-local"
              value={milestone.timestamp}
              onChange={(e) => setMilestone({...milestone, timestamp: e.target.value})}
              className={`w-full px-3 py-2 rounded border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Notes
            </label>
            <textarea
              value={milestone.notes}
              onChange={(e) => setMilestone({...milestone, notes: e.target.value})}
              rows={3}
              className={`w-full px-3 py-2 rounded border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Add Milestone
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MilestoneModal;
