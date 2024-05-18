import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AppProvider } from './context/app-context';
import { ShipmentManagementProvider } from './context/ShipmentManagementContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <AppProvider>
      <ShipmentManagementProvider>
          <App />
      </ShipmentManagementProvider>
  </AppProvider>
);