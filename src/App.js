import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Login from './pages/login/login';
import { RouterProvider } from 'react-router-dom';
import { router } from './config/routes';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

function App() {
  const authData = JSON.parse(localStorage.getItem('auth'))
  
  return (
    <>
      {
        authData && authData.username
          ? <LocalizationProvider dateAdapter={AdapterDateFns}>
              <RouterProvider router={router} />
            </LocalizationProvider>
          : <Login />
      }
      <ToastContainer position="bottom-right" autoClose={5000} closeOnClick pauseOnHover theme="light" />
    </>
  );
}

export default App;
