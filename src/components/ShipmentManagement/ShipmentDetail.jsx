// src/components/ShipmentManagement/ShipmentDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Truck, Package, MapPin, Calendar, Clock, 
  User, Phone, Mail, DollarSign, FileText,
  CheckCircle, AlertCircle
} from 'lucide-react';
import api from '../../services/api';

const ShipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
    fetchShipmentDetail();
  }, [id]);

  const fetchShipmentDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/shipments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShipment(response.data.shipment);
    } catch (error) {
      console.error('Error fetching shipment:', error);
      alert('Error loading shipment details');
      navigate('/shipments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMilestone = async (type, location, notes) => {
    try {
      const response = await api.post(
        `/shipments/${id}/milestone`,
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
    <div className={`p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-2">{shipment.shipmentNumber}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Created: {new Date(shipment.createdAt).toLocaleDateString()}</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
              {shipment.status}
            </span>
          </div>
        </div>
        <button
          onClick={() => navigate('/shipments')}
          className="px-4 py-2 border rounded hover:bg-gray-50"
        >
          Back to List
        </button>
      </div>

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

          {/* Carrier Info */}
          <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200'}`}>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5" /> Carrier Information
            </h3>
            {shipment.carrier?.name ? (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">Carrier:</span> {shipment.carrier.name}</div>
                <div><span className="text-gray-500">Contact:</span> {shipment.carrier.contact}</div>
                <div><span className="text-gray-500">Phone:</span> {shipment.carrier.phone}</div>
                <div><span className="text-gray-500">Email:</span> {shipment.carrier.email}</div>
                <div><span className="text-gray-500">PRO#:</span> {shipment.carrier.proNumber}</div>
                <div><span className="text-gray-500">Driver:</span> {shipment.carrier.driverName}</div>
              </div>
            ) : (
              <div className="text-gray-500">No carrier assigned yet</div>
            )}
          </div>

          {/* Milestones */}
          <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5" /> Milestones
              </h3>
              <button
                onClick={() => setShowMilestoneModal(true)}
                className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
              >
                Add Milestone
              </button>
            </div>
            <div className="space-y-3">
              {shipment.milestones?.map((milestone, index) => (
                <div key={index} className="flex items-start gap-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                  <div className="flex-1">
                    <div className="font-medium">{milestone.type}</div>
                    <div className="text-gray-500">
                      {new Date(milestone.timestamp).toLocaleString()}
                      {milestone.location && ` - ${milestone.location}`}
                    </div>
                    {milestone.notes && <div className="text-gray-600">{milestone.notes}</div>}
                  </div>
                </div>
              ))}
              {(!shipment.milestones || shipment.milestones.length === 0) && (
                <div className="text-gray-500">No milestones recorded yet</div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cargo Details */}
          <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200'}`}>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Package className="w-5 h-5" /> Cargo Details
            </h3>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-500">Pieces:</span> {shipment.cargo?.pieces}</div>
              <div><span className="text-gray-500">Weight:</span> {shipment.cargo?.weight} lbs</div>
              <div><span className="text-gray-500">Description:</span> {shipment.cargo?.description}</div>
              <div><span className="text-gray-500">Value:</span> ${shipment.cargo?.value}</div>
            </div>
          </div>

          {/* Financial */}
          <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200'}`}>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="w-5 h-5" /> Financial
            </h3>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-500">Customer Price:</span> ${shipment.costs?.customerPrice}</div>
              <div><span className="text-gray-500">Carrier Cost:</span> ${shipment.costs?.carrierCost}</div>
              <div className="pt-2 border-t">
                <span className="text-gray-500">Profit Margin:</span> 
                <span className="font-semibold text-green-600"> ${shipment.costs?.profitMargin}</span>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className={`p-4 rounded-lg border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200'}`}>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5" /> Dates
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <div className="text-gray-500">Scheduled Pickup</div>
                <div>{shipment.scheduledPickup ? new Date(shipment.scheduledPickup).toLocaleDateString() : 'TBD'}</div>
              </div>
              <div>
                <div className="text-gray-500">Scheduled Delivery</div>
                <div>{shipment.scheduledDelivery ? new Date(shipment.scheduledDelivery).toLocaleDateString() : 'TBD'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Milestone Modal */}
      {showMilestoneModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg max-w-md w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-lg font-semibold mb-4">Add Milestone</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleAddMilestone(
                formData.get('type'),
                formData.get('location'),
                formData.get('notes')
              );
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select name="type" className="w-full p-2 border rounded" required>
                    {milestoneTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input type="text" name="location" className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <textarea name="notes" className="w-full p-2 border rounded" rows="3"></textarea>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Add Milestone
                </button>
                <button
                  type="button"
                  onClick={() => setShowMilestoneModal(false)}
                  className="flex-1 px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipmentDetail;
