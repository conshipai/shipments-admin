import React from 'react';

const App = ({ shellContext, basename }) => {
  // Log the full context
  console.log('Shipments Admin - Full Context:', shellContext);
  
  // Check for token
  const hasToken = !!shellContext?.token;
  const tokenPreview = shellContext?.token ? 
    `${shellContext.token.substring(0, 30)}...` : 
    'No token found';
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Shipments Admin - Debug Mode</h1>
      
      <h2>Authentication Status:</h2>
      <ul>
        <li>Has Token: {hasToken ? '✅ YES' : '❌ NO'}</li>
        <li>Token Preview: {tokenPreview}</li>
        <li>User: {shellContext?.user?.email || 'No user'}</li>
        <li>Role: {shellContext?.user?.role || 'No role'}</li>
      </ul>
      
      <h2>Full Context (JSON):</h2>
      <pre style={{ 
        background: '#f0f0f0', 
        padding: '10px', 
        borderRadius: '5px',
        overflow: 'auto',
        maxHeight: '400px'
      }}>
        {JSON.stringify(shellContext, null, 2)}
      </pre>
      
      <h2>Basename:</h2>
      <p>{basename}</p>
    </div>
  );
};

export default App;
