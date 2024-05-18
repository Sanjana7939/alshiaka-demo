import * as React from 'react';
import { Outlet, createBrowserRouter } from 'react-router-dom';
import { Box, Stack, CircularProgress } from '@mui/material';
import Sidebar from '../components/sidebar';
import Dashboard from '../pages/dashboard/index';
import { notify } from '../utils';
import { AppConstants } from './app-config';
import DataScreen from '../pages/dataScreen';
import Login from '../pages/login/login';

const AppLayout = () => {
  const [isApplicationLoaded, setIsApplicationLoaded] = React.useState(false);

  const intialUserDataFetch = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem('auth'))
      console.log('authdata =====', authData)
      const { username } = authData
      setIsApplicationLoaded(true);
      localStorage.setItem("username", username)
    } catch (e) {
      setIsApplicationLoaded(false);
      throw(e)
    }
  }

  React.useEffect(() => {
    intialUserDataFetch().then((e)=> {
      setIsApplicationLoaded(true);
    }).catch((err) => {
      notify(AppConstants.ERROR, err.message);
    })
  }, [setIsApplicationLoaded])

  if (!isApplicationLoaded) {
    return (
      <Stack
        sx={{
          width: "100%",
          padding: " 0 0 3vh 0",
          justifyContent: "center",
          alignItems: "center",
          rowGap: "16px",
          columnGap: "16px",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Box sx={{
      height: '100vh', display: 'flex', flexDirection: 'row', overflow: 'hidden',
    }}
    >
      <Sidebar />
      <Outlet />
    </Box>
  );
};

export const routes = [
  {
    path: '/',
    element: <Dashboard/>,
  },
  {
    path: '/dashboard',
    element: <Dashboard/>,
  },
  {
    path: '/data',
    element: <DataScreen />,
  },
];

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [...routes],
  },
]);



