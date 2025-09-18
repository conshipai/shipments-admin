// src/App.jsx
import React, { useState, useEffect } from 'react';
import { 
  Package, Truck, CheckCircle, Clock, AlertCircle, 
  FileText, Settings 
} from 'lucide-react';
import api from './services/api';
import PendingBookings from './components/BookingManagement/PendingBookings';
import ActiveShipments from './components/ShipmentManagement/ActiveShipments';
import CompletedShipments from './components/ShipmentManagement/CompletedShipments';
import DocumentTypes from './components/Admin/DocumentTypes';

const App = ({ shellContext, basename }) => {
  const [activeTab, setActiveTab] = useState('pending');
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    pending: 0,
    active: 0,
    completed: 0
  });
  
  // Get context from shell or localStorage
  const context = shellContext || window.shellContext || {};
  const isDarkMode = context.isDarkMode || false;
  
  useEffect(() => {
    // Get user from context or fetch it
    const initUser = async () => {
      if (context.user) {
        setUser(context.user);
      } else {
        // Try to get user from token
        const token = localStorage.getItem('auth_token');
        if (token) {
          try {
            const response = await api.get('/auth/verify');
            setUser(response.data.user);
          } catch (error) {
            console.error('Failed to verify user:', error);
          }
        }
      }
    };
    
    initUser();
    fetchStats();
  }, []);
  
  const fetchStats = async () => {
    try {
      const [bookingsRes, shipmentsRes] = await Promise.all([
        api.get('/booking-requests?status=pending_review'),
        api.get('/shipments')
      ]);
      
      const pendingCount = bookingsRes.data.bookingRequests?.length || 0;
      const shipments = shipmentsRes.data.shipments || [];
      const activeCount = shipments.filter(s => 
        !['DELIVERED', 'COMPLETED', 'CANCELLED'].includes(s.status)
      ).length;
      const completedCount = shipments.filter(s => 
        ['DELIVERED', 'COMPLETED'].includes(s.status)
      ).length;
      
      setStats({
        pending: pendingCount,
        active: activeCount,
        completed: completedCount
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };
  
  // Check permissions
  const isAdmin = user?.role === 'system_admin' || user?.role === 'conship_employee';
  const canEdit = isAdmin;
  const canView = true; // Everyone can view their own shipments
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400 animate-spin" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!canView) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-bold text-red-600">Access Denied</h2>
          <p className="mt-2">You don't have permission to access this application.</p>
        </div>
      </div>
    );
  }
  
  const tabs = [
    { 
      id: 'pending', 
      label: 'Pending Bookings', 
      icon: Clock, 
      count: stats.pending,
      showCount: true,
      adminOnly: false 
    },
    { 
      id: 'active', 
      label: 'Active Shipments', 
      icon: Truck, 
      count: stats.active,
      showCount: true,
      adminOnly: false 
    },
    { 
      id: 'completed', 
      label: 'Completed', 
      icon: CheckCircle, 
      count: stats.completed,
      showCount: false,
      adminOnly: false 
    },
    { 
      id: 'documents', 
      label: 'Document Types', 
      icon: Settings, 
      adminOnly: true 
    }
  ];
  
  const visibleTabs = tabs.filter(tab => !tab.adminOnly || isAdmin);
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Shipments Admin</h1>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Manage bookings and shipments • {user?.name || user?.email} 
                  {isAdmin && <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Admin</span>}
                </p>
              </div>
              <button
                onClick={fetchStats}
                className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                🔄 Refresh
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-1">
            {visibleTabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? isDarkMode 
                        ? 'border-purple-500 text-purple-400' 
                        : 'border-purple-600 text-purple-600'
                      : isDarkMode
                        ? 'border-transparent text-gray-400 hover:text-gray-300'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.showCount && tab.count > 0 && (
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.id
                        ? 'bg-purple-100 text-purple-800'
                        : isDarkMode
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-gray-200 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'pending' && (
          <PendingBookings 
            user={user} 
            canEdit={canEdit} 
            isDarkMode={isDarkMode}
            onUpdate={fetchStats}
          />
        )}
        
        {activeTab === 'active' && (
          <ActiveShipments 
            user={user} 
            canEdit={canEdit} 
            isDarkMode={isDarkMode}
            onUpdate={fetchStats}
          />
        )}
        
        {activeTab === 'completed' && (
          <CompletedShipments 
            user={user} 
            canEdit={canEdit} 
            isDarkMode={isDarkMode}
          />
        )}
        
        {activeTab === 'documents' && isAdmin && (
          <DocumentTypes 
            isDarkMode={isDarkMode}
          />
        )}
      </div>
    </div>
  );
};

export default App;
