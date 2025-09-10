// src/components/BookingReview/BookingList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Clock, Package, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../../services/api';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('PENDING');
  const navigate = useNavigate();
  
  const shellContext = window.shellContext || {};
  const { token, isDarkMode } = shellContext;

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bookings', {
        headers: { Authorization: `Bearer ${token}` },
        params: { status: filter }
      });
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConvertToShipment = async (bookingId) => {
    if (!confirm('Convert this booking to a shipment?')) return;
    
    try {
      const response = await api.post('/shipments/convert', 
        { bookingId },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      if (response.data.success) {
        alert('Shipment created successfully!');
        navigate(`/shipments/${response.data.shipment._id}`);
      }
    } catch (error) {
      alert('Error creating shipment: ' + error.message);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'PENDING': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'CONFIRMED': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'CONVERTED_TO_SHIPMENT': return <Truck className="w-5 h-5 text-blue-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Booking Review</h1>
        
        {/* Filter Tabs */}
        <div className="flex space-x-4 border-b">
          {['PENDING', 'CONFIRMED', 'ALL'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`pb-2 px-4 ${
                filter === status 
                  ? 'border-b-2 border-purple-600 text-purple-600' 
                  : 'text-gray-500'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading bookings...</div>
      ) : (
        <div className="grid gap-4">
          {bookings.map(booking => (
            <div 
              key={booking._id} 
              className={`p-4 rounded-lg border ${
                isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(booking.status)}
                    <span className="font-semibold">
                      Booking #{booking.bookingNumber || booking._id.slice(-6)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">From:</span> {booking.originCity}, {booking.originState}
                    </div>
                    <div>
                      <span className="text-gray-500">To:</span> {booking.destCity}, {booking.destState}
                    </div>
                    <div>
                      <span className="text-gray-500">Weight:</span> {booking.totalWeight} lbs
                    </div>
                    <div>
                      <span className="text-gray-500">Price:</span> ${booking.price}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {booking.status === 'PENDING' && (
                    <button
                      onClick={() => handleConvertToShipment(booking._id)}
                      className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                      Convert to Shipment
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {bookings.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No bookings found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingList;
