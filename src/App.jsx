import React from 'react';

const App = ({ shellContext, basename }) => {
  // Get context from props or window
  const context = shellContext || window.shellContext || {};
  const { user, token, isDarkMode } = context;
  
  console.log('Shipments Admin loaded with user:', user?.email, 'role:', user?.role);
  
  // Check permissions
  const hasAccess = user && ['system_admin', 'conship_employee'].includes(user?.role);
  
  if (!hasAccess) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600">Access Denied</h2>
        <p>You don't have permission to access this application.</p>
        <p className="text-sm mt-2 text-gray-500">Your role: {user?.role || 'unknown'}</p>
      </div>
    );
  }
  
  // For now, just show a working interface
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Shipments Admin</h1>
        
        <div className="grid gap-4">
          <div className="p-4 border rounded-lg">
            <h2 className="text-lg font-semibold mb-2">✅ Module Federation: Working</h2>
            <p>The app is loading successfully from the remote.</p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h2 className="text-lg font-semibold mb-2">✅ Authentication: Working</h2>
            <p>User: {user?.email}</p>
            <p>Role: {user?.role}</p>
            <p>Token: {token ? 'Present' : 'Missing'}</p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Next Steps</h2>
            <p>Once this is working, we'll add the routing and components back.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
