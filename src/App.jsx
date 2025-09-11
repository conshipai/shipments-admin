import React from 'react';

const App = ({ shellContext, basename }) => {
  console.log('Shipments Admin App mounted!', { shellContext, basename });
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Shipments Admin - Test Version</h1>
      <p>If you see this, Module Federation is working!</p>
      <pre>{JSON.stringify({ shellContext, basename }, null, 2)}</pre>
    </div>
  );
};

export default App;
