import { useContext, useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { AppContext } from '../../context/app-context';
import { AppTheme } from '../../utils/theme';
import { Button } from '@mui/material';
import { AppConstants } from '../../config/app-config';

export default function ResponsiveAppBar({ title }) {
  const { userRoleId, setUserRoleId, user, setUser, isSidebarExpanded, setIsSidebarExpanded } = useContext(AppContext);

  useEffect(() => {
    (async () => {
      try {
        if (!userRoleId) {
          setUserRoleId(localStorage.getItem('userRoleId'))
        }
        if (!user) {
          const localStorageUser = localStorage.getItem('userName');
          if (localStorageUser) {
            setUser(localStorageUser);
          } else {
            const username = 'ADMIN'
            setUser(username);
            localStorage.setItem("userName", username);
          }
        }
      } catch (e) {
        console.error(e.message);
        notify(AppConstants.ERROR, e.msg);
      }
    })();
  }, []);

  return (
    <AppBar position="static" style={{ backgroundColor: 'white', color: AppTheme.fontColor }}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title || ''}
        </Typography>
        {user && (
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <Button sx={{ m: 0, p: 0, color: AppTheme.fontColor }}><AccountCircle /> {user}</Button>
            <Button sx={{ color: AppTheme.fontGrey, m: 0, p: 0, fontSize: 12 }}>{userRoleId}</Button>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}
