import React from 'react';
import '@aws-amplify/ui-react/styles.css';
import { awsconfig } from './config/aws-config';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { Amplify } from 'aws-amplify';
import Login from './pages/login/login';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { RouterProvider } from 'react-router-dom';
import { router } from './config/routes';
import { AppConstants } from './config/app-config';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useContext, useEffect } from 'react';
import { notify, checkRoleAccess } from './utils';
import { Auth } from 'aws-amplify';
import { AppContext } from './context/app-context';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

Amplify.configure(awsconfig);
dayjs.extend(utc);
dayjs.extend(timezone);

function App() {
  const { route } = useAuthenticator((context) => [context.route]);
  const {clearAppContext} = useContext(AppContext)
  
  return (
    <>
      {
        route === AppConstants.AUTHENTICATED
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
