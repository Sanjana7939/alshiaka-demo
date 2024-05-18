import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AppProvider } from './context/app-context';
import { ShipmentManagementProvider } from './context/ShipmentManagementContext';
import { UserManagementProvider } from './context/UserManagementContext';
import { LovProvider } from './context/LovContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <AppProvider>
    <UserManagementProvider>
      <ShipmentManagementProvider>
        <LovProvider>
          <App />
        </LovProvider>
      </ShipmentManagementProvider>
    </UserManagementProvider>
  </AppProvider>
);