// src/components/BookingManagement/PendingBookings.jsx
import React, { useState, useEffect } from 'react';
import { 
  Clock, Check, X, MessageCircle, Truck, Package, 
  MapPin, Calendar, User, DollarSign, Eye, AlertCircle 
} from 'lucide-react';
import api from '../../services/api';
import BookingApprovalModal from './BookingApprovalModal';

const PendingBookings = ({ user, canEdit, isDarkMode, onUpdate }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  
  useEffect(() => {
    fetchBookings();
  }, []);
  
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/booking-requests?status=pending_review');
      setBookings(response.data.bookingRequests || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleApprove = (booking) => {
    setSelectedBooking(booking);
    setShowApprovalModal(true);
  };
  
  const handleReject = async (booking, reason) => {
    if (!window.confirm(`Reject booking ${booking.requestNumber}?`)) return;
    
    try {
      await api.put(`/booking-requests/${booking._id}/status`, {
        status: 'rejected',
        notes: reason || 'Rejected by admin'
      });
      
      alert('Booking rejected');
      fetchBookings();
      onUpdate();
    } catch (error) {
      alert('Error rejecting booking: ' + error.message);
    }
  };
  
  const handleRequestInfo = async (booking) => {
    const info = window.prompt('What additional information do you need?');
    if (!info) return;
    
    try {
      await api.put(`/booking-requests/${booking._id}/status`, {
        status: 'needs_info',
        notes: info
      });
      
      alert('Information request sent to customer');
      fetchBookings();
      onUpdate();
    } catch (error) {
      alert('Error requesting information: ' + error.message);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Clock className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }
  
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium">No pending bookings</h3>
        <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          All bookings have been processed
        </p>
      </div>
    );
  }
  
  return (
    <>
      <div className="space-y-4">
        {bookings.map(booking => (
          <div 
            key={booking._id}
            className={`rounded-lg border p-6 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}
          >
            {/* Booking Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">
                    {booking.requestNumber || `BR-${booking._id.slice(-6)}`}
                  </h3>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    Pending Review
                  </span>
                </div>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Submitted {new Date(booking.createdAt).toLocaleString()}
                  {booking.customerEmail && ` • ${booking.customerEmail}`}
                </p>
              </div>
              
              {/* Action Buttons */}
              {canEdit && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(booking)}
                    className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    <Check className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(booking)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleRequestInfo(booking)}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Request Info
                  </button>
                </div>
              )}
            </div>
            
            {/* Booking Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Pickup */}
              <div className={`p-3 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span className="font-medium text-sm">Pickup</span>
                </div>
                <p className="text-sm">{booking.pickup?.company}</p>
                <p className="text-sm">
                  {booking.pickup?.city}, {booking.pickup?.state} {booking.pickup?.zip}
                </p>
                <p className="text-sm">
                  {booking.pickup?.readyDate && new Date(booking.pickup.readyDate).toLocaleDateString()}
                </p>
              </div>
              
              {/* Delivery */}
              <div className={`p-3 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-green-500" />
                  <span className="font-medium text-sm">Delivery</span>
                </div>
                <p className="text-sm">{booking.delivery?.company}</p>
                <p className="text-sm">
                  {booking.delivery?.city}, {booking.delivery?.state} {booking.delivery?.zip}
                </p>
                {booking.delivery?.requiredDate && (
                  <p className="text-sm">
                    Required: {new Date(booking.delivery.requiredDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              
              {/* Cargo */}
              <div className={`p-3 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-purple-500" />
                  <span className="font-medium text-sm">Cargo</span>
                </div>
                <p className="text-sm">{booking.cargo?.totalWeight} lbs</p>
                <p className="text-sm">{booking.cargo?.totalPieces} pieces</p>
                <p className="text-sm">{booking.cargo?.description}</p>
              </div>
            </div>
            
            {/* Pricing Info */}
            {booking.pricing && (
              <div className={`mt-4 p-3 rounded flex items-center justify-between ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Quote Price: ${booking.pricing.total}</span>
                  {booking.pricing.carrier && (
                    <span className="text-sm">• Carrier: {booking.pricing.carrier}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Approval Modal */}
      {showApprovalModal && selectedBooking && (
        <BookingApprovalModal
          booking={selectedBooking}
          isDarkMode={isDarkMode}
          onClose={() => {
            setShowApprovalModal(false);
            setSelectedBooking(null);
          }}
          onApprove={() => {
            fetchBookings();
            onUpdate();
            setShowApprovalModal(false);
            setSelectedBooking(null);
          }}
        />
      )}
    </>
  );
};

export default PendingBookings;
