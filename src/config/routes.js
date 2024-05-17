import * as React from 'react';
import { Outlet, createBrowserRouter } from 'react-router-dom';
import { Box, Stack, CircularProgress } from '@mui/material';
import Sidebar from '../components/sidebar';
import Dashboard from '../pages/dashboard/index';
import User from '../pages/user/index'
import Role from '../pages/roles/index'
import { getRoleByRoleId, getUserById } from '../api/index'
import { notify, checkRoleAccess } from '../utils';
import { AppConstants } from './app-config';
import { Auth } from 'aws-amplify';
import { AppContext } from '../context/app-context';
import PlanningScreen from '../pages/planningScreen';
import LogisticsScreen from '../pages/logisticsScreen';
import SecurityScreen from '../pages/securityScreen';
import TeamLeaderScreen from '../pages/teamLeaderScreen';
import FileUploadScreen from '../pages/fileUploadScreen';
import LOV from '../pages/lov';
import DataScreen from '../pages/dataScreen';

const AppLayout = () => {
  const [open, setOpen] = React.useState(false);
  const [userRoleManagement, setUserRoleManagement] = React.useState([])
  const { clearAppContext } = React.useContext(AppContext)
  const [isApplicationLoaded, setIsApplicationLoaded] = React.useState(false);
  const handleSignOut = async () => {
    try {
      await Auth.signOut();
    } catch (error) {
      notify(AppConstants.ERROR, error.message);
    } finally {
      localStorage.clear();
      clearAppContext();
    }
  }

  const intialUserDataFetch = async () => {
    try {
      const { username } = await Auth.currentUserInfo();
      console.log("before api call ", username)
      const response = await getUserById({ userIds: username })
      const roleId = response.users[0].roleId
      const roleStatus = response.users[0].roleStatus
      if (roleStatus !== "INVALID") {
        localStorage.setItem("roleStatus", roleStatus)
        const roleResponse = await getRoleByRoleId({ roleIds: roleId })
        console.log(roleResponse)
        localStorage.setItem("userRoleManagement", JSON.stringify(roleResponse))
        localStorage.setItem("userRoleId", roleId)
        setUserRoleManagement(roleResponse)
        setIsApplicationLoaded(true);
      } else {
        notify(AppConstants.ERROR, `${username} is INVALID, Contact to admin`)
        handleSignOut();
        setIsApplicationLoaded(false);
      }
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
    path: '/user',
    element: <User />,
  },
  {
    path: '/role',
    element: <Role />,
  },
  {
    path: '/planning',
    element: <PlanningScreen />,
  },
  {
    path: '/logistics',
    element: <LogisticsScreen />,
  },
  {
    path: '/security',
    element: <SecurityScreen />,
  },
  {
    path: '/teamLeader',
    element: <TeamLeaderScreen />,
  },
  {
    path: '/fileUpload',
    element: <FileUploadScreen />,
  },
  {
    path: '/lov',
    element: <LOV />,
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



