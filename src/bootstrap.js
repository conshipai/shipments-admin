import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Mount function for Module Federation
const mount = (el, { shellContext, basename } = {}) => {
  const root = ReactDOM.createRoot(el);
  root.render(
    <React.StrictMode>
      <App shellContext={shellContext} basename={basename} />
    </React.StrictMode>
  );
  return root;
};

// If running standalone (not in shell)
if (!window.__POWERED_BY_FEDERATION__) {
  const devRoot = document.querySelector('#root');
  if (devRoot) {
    mount(devRoot, {
      shellContext: {
        user: { role: 'system_admin', name: 'Dev User' },
        token: 'dev-token',
        isDarkMode: false
      }
    });
  }
}

// Export mount for Module Federation
export { mount };
