import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const mount = (el) => {
  const root = ReactDOM.createRoot(el);
  root.render(<App />);
};

// If running in isolation
if (!window.__POWERED_BY_FEDERATION__) {
  const devRoot = document.querySelector('#root');
  if (devRoot) {
    mount(devRoot);
  }
}

export { mount };
