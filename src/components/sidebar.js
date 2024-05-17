/* eslint-disable no-unused-vars */
import {
  ExpandMore, ExpandLess, Assessment, Logout
} from '@mui/icons-material';
import {
  Box, Stack, Tooltip, Typography, Divider
} from '@mui/material';
import {
  useContext, useState, useEffect, useMemo,
} from 'react';
import { AppContext } from '../context/app-context';
import { ShipmentManagementContext } from '../context/ShipmentManagementContext';

import { Auth } from 'aws-amplify';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppConstants, notify } from '../config/app-config';
import useBreakpoints from './useBreakPoints';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { checkRoleAccess } from '../utils';
import { AppTheme } from '../utils/theme';
import companyLogo from '../assets/images/logo.png'
import { UserManagementContext } from '../context/UserManagementContext';
import { LovContext } from '../context/LovContext';

const getItemStyles = (currentPath, path) => ({
  height: '40px',
  px: 1,
  transition: 'transform 0.3s ease-in-out',
  ':hover': { backgroundColor: '#5c8eff', borderRadius: 2 },
  backgroundColor: path && currentPath === path ? '#5c8eff' : '',
  borderRadius: path && currentPath === path ? 2 : '',
  cursor: 'pointer',
});

export default function Sidebar() {
  const [currentPath, setCurrentPath] = useState();
  const [open, setOpen] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const { isXs, isSm, isMd, isLg, isXl } = useBreakpoints();
  const { isSidebarExpanded, clearAppContext, setDashboardLoading, setRolesLoading } = useContext(AppContext);
  const { clearUserManagementContext } = useContext(UserManagementContext);
  const { clearShipmentManagementData } = useContext(ShipmentManagementContext);
  const { clearLovContext } = useContext(LovContext);

  const routeParams = useMemo(() => ({
    navigate, isSidebarExpanded, currentPath, location,
  }), [currentPath, isSidebarExpanded, location, navigate]);

  const actionParams = useMemo(() => ({
    isSidebarExpanded, setOpen,
  }), [isSidebarExpanded]);

  const signOut = async () => {
    try {
      await Auth.signOut();
    } catch (error) {
      notify(AppConstants.ERROR, error.message);
    } finally {
      localStorage.clear();
      clearAppContext();
    }
  };

  const tools = [
    {
      icon: Logout,
      label: 'Sign Out',
      method: signOut,
    }
  ];
  const routes = [
    {
      icon: Assessment,
      label: 'Dashboard',
      path: '/dashboard',
      permission: true,
    },
    {
      icon: AutoGraphIcon,
      label: 'Data',
      path: '/data',
      permission: true,
    },
  ];


  useEffect(() => {
    setDashboardLoading(true)
    setCurrentPath(location.pathname !== '/' ? location.pathname : '/dashboard');
    setRolesLoading(true)
    clearUserManagementContext()    
    clearShipmentManagementData()
    clearLovContext()
  }, [location]);

  const getSidebarStyles = ({ isSidebarExpanded }) => ({
    backgroundColor: AppTheme['sidebar-bg-color'],
    height: '100vh',
    width: isSidebarExpanded ? '245px' : '60px',
    color: 'white',
    pt: '10px',
    pb: '10px',
    // pr: !isSidebarExpanded ? 0.4 : 0,
    // pl: 0.2,
    position: isSidebarExpanded && isXs ? 'fixed' : 'static',
    zIndex: isSidebarExpanded && isXs ? 1000 : 'auto', // Set a high z-index for overlay
    top: 0,
    left: 0,
    transition: 'width 0.3s ease',
  });



  return (
    <Stack direction="column" sx={getSidebarStyles({ isSidebarExpanded })}>

      <Stack justifyContent="flex-start" sx={{ px: 0, py: 0 }}>
        <div style={{ paddingLeft: '10px', paddingRight: '10px' }}>
          <img src={companyLogo} alt="Apparel Group" style={{ width: '100%' }} />
        </div>
      </Stack>

      <Stack flex={1} justifyContent="flex-start" sx={{ pt: 6, px: 0.2 }} spacing={0.5}>
        {routes.map((route, index) => (
          route.permission && (
            !route.children
              ? <RouteItem key={index} {...{ ...route, ...routeParams }} />
              : <RouteItemWithChildren key={index} {...{ ...route, ...routeParams }} />
          )
        ))}
      </Stack>
      <Stack justifyContent="flex-end" sx={{ px: 0.2 }}>
        {tools.map((item, index) => (<ActionItem key={index} {...{ ...item, ...actionParams }} />))}
      </Stack>
    </Stack>
  );
}

const RouteItem = ({ ...props }) => (
  props.permission && (
    <Stack direction="column">
      <Item {...props} onClick={() => props.navigate(props.path)} />
    </Stack>
  )
);

const RouteItemWithChildren = ({ ...props }) => {
  const [isChildrenExpanded, setIsChildrenExpanded] = useState(false);
  const { isXs, isSm, isMd, isLg, isXl } = useBreakpoints();

  return (
    <Stack direction="column">
      {props.isSidebarExpanded && (
        <Item
          {...props}
          onClick={() => setIsChildrenExpanded(!isChildrenExpanded)}
          isChildrenExpanded={isChildrenExpanded}
          iconSize={props.responsiveIconSize}
          fontSize={props.responsiveFontSize}
          hasChild
        />
      )}
      {props.isSidebarExpanded ? (
        <Stack direction="column" justifyContent="flex-start" sx={{ pt: 0.5, pl: 2 }} spacing={0.5}>
          {isChildrenExpanded &&
            props.children
              .filter((child) => child.permission !== false) // Filter out children with false permission
              .map((child, index) => (
                <Stack direction="column" key={index}>
                  <Divider orientation="vertical" flexItem light />
                  <Item
                    key={index}
                    {...child}
                    iconSize={20}
                    fontSize="12px"
                    spacing={1}
                    navigate={props.navigate}
                    isSidebarExpanded={props.isSidebarExpanded}
                    currentPath={props.currentPath}
                    location={props.location}
                    onClick={() => {
                      props.navigate(child.path);
                      if (props.isSidebarCollapseBreakPoint) props.setIsSidebarExpanded(false);
                    }}
                  />
                </Stack>
              ))}
        </Stack>
      ) : (
        <Stack direction="column" justifyContent="flex-start" spacing={0.5}>
          {props.children
            .filter((child) => child.permission !== false) // Filter out children with false permission
            .map((child, index) => (
              <Stack direction="column" key={index}>
                <Divider orientation="vertical" flexItem light />
                <Item {...child} iconSize={props.responsiveIconSize} fontSize={props.responsiveFontSize} onClick={() => props.navigate(child.path)} />
              </Stack>
            ))}
        </Stack>
      )}
    </Stack>
  );
};

const Item = ({ icon, ...props }) => (
  props.isSidebarExpanded
    ? (<ItemWhenExpanded iconSize={props.iconSize ?? 26} {...props} Icon={icon} />)
    : (<ItemWhenCollapsed iconSize={26} {...props} Icon={icon} />)
);

const ActionItem = ({ setOpen, ...props }) => (
  <Stack direction="column">
    <Item {...props} onClick={() => props.method({ setOpen, ...props })} />
  </Stack>
);

const ItemWhenCollapsed = ({ Icon, ...props }) => (
  <Tooltip title={props.label} placement="right">
    <Stack direction="row" alignItems="center" sx={() => getItemStyles(props.currentPath, props.path)} onClick={() => props.onClick()}>
      <Icon sx={{ fontSize: props.iconSize }} />
    </Stack>
  </Tooltip>
);

const ItemWhenExpanded = ({ Icon, EndAdornment, ...props }) => {
  const { isXs, isSm, isMd, isLg, isXl } = useBreakpoints();
  return (
    <Box sx={{ marginLeft: props.marginLeft ?? '0px' }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={() => getItemStyles(props.currentPath, props.path)} onClick={() => props.onClick()}>
        <Icon sx={{ fontSize: props.iconSize }} />
        <Typography sx={{ animation: 'fadein 0.9s', fontSize: isMd || isSm ? '12px' : props.fontSize ?? '15px', fontWeight: '600' }} variant="subtitle1">
          {props.label === 'Store' && props.storeId ? `${props.label}#${props.storeId}` : props.label}
        </Typography>
        {props.hasChild && (props.isChildrenExpanded ? <ExpandMore /> : <ExpandLess />)}
      </Stack>
    </Box>
  )
};