// src/components/BookingManagement/BookingApprovalModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Truck, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const BookingApprovalModal = ({ booking, isDarkMode, onClose, onApprove }) => {
  const [carrier, setCarrier] = useState('');
  const [carrierContact, setCarrierContact] = useState({
    name: '',
    phone: '',
    email: '',
    proNumber: ''
  });
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [carriers, setCarriers] = useState([]);
  
  useEffect(() => {
    fetchCarriers();
  }, []);
  
  const fetchCarriers = async () => {
    try {
      // Fetch available carriers
      const response = await api.get('/carriers');
      setCarriers(response.data.carriers || []);
    } catch (error) {
      console.error('Error fetching carriers:', error);
      // Fallback carriers
      setCarriers([
        { name: 'FedEx Freight', id: 'fedex' },
        { name: 'UPS Freight', id: 'ups' },
        { name: 'XPO Logistics', id: 'xpo' },
        { name: 'Old Dominion', id: 'old_dominion' },
        { name: 'Estes Express', id: 'estes' }
      ]);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!carrier) {
      alert('Please select a carrier');
      return;
    }
    
    setLoading(true);
    
    try {
      // First, approve the booking and assign carrier
      await api.put(`/booking-requests/${booking._id}/approve`, {
        carrier,
        carrierContact,
        notes,
        status: 'approved'
      });
      
      // Create shipment from the approved booking
      const shipmentResponse = await api.post('/shipments/create-from-booking', {
        bookingId: booking._id,
        carrier,
        carrierContact
      });
      
      alert('Booking approved and shipment created!');
      onApprove();
    } catch (error) {
      alert('Error approving booking: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-2xl rounded-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Approve Booking & Assign Carrier</h2>
            <button
              onClick={onClose}
              className={`p-1 rounded hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Booking Summary */}
          <div className={`mb-6 p-4 rounded ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <h3 className="font-medium mb-2">Booking Summary</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Request #: {booking.requestNumber}</div>
              <div>Customer: {booking.customerEmail}</div>
              <div>From: {booking.pickup?.city}, {booking.pickup?.state}</div>
              <div>To: {booking.delivery?.city}, {booking.delivery?.state}</div>
              <div>Weight: {booking.cargo?.totalWeight} lbs</div>
              <div>Price: ${booking.pricing?.total}</div>
            </div>
          </div>
          
          {/* Carrier Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Select Carrier *
            </label>
            <select
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              required
              className={`w-full px-3 py-2 rounded border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
            >
              <option value="">-- Select Carrier --</option>
              {carriers.map(c => (
                <option key={c.id || c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Carrier Contact Details */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Driver/Contact Name
              </label>
              <input
                type="text"
                value={carrierContact.name}
                onChange={(e) => setCarrierContact({
                  ...carrierContact,
                  name: e.target.value
                })}
                className={`w-full px-3 py-2 rounded border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={carrierContact.phone}
                onChange={(e) => setCarrierContact({
                  ...carrierContact,
                  phone: e.target.value
                })}
                className={`w-full px-3 py-2 rounded border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={carrierContact.email}
                onChange={(e) => setCarrierContact({
                  ...carrierContact,
                  email: e.target.value
                })}
                className={`w-full px-3 py-2 rounded border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                PRO Number
              </label>
              <input
                type="text"
                value={carrierContact.proNumber}
                onChange={(e) => setCarrierContact({
                  ...carrierContact,
                  proNumber: e.target.value
                })}
                className={`w-full px-3 py-2 rounded border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>
          </div>
          
          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Internal Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Any special instructions or notes..."
              className={`w-full px-3 py-2 rounded border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>
          
          {/* Alert */}
          <div className={`mb-6 p-4 rounded flex items-start gap-3 ${
            isDarkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200'
          } border`}>
            <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">This action will:</p>
              <ul className="mt-1 list-disc list-inside">
                <li>Approve the booking request</li>
                <li>Create a new shipment</li>
                <li>Assign the selected carrier</li>
                <li>Send confirmation to the customer</li>
              </ul>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
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
              disabled={loading}
              className={`px-6 py-2 rounded text-white ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {loading ? 'Processing...' : 'Approve & Create Shipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingApprovalModal;
