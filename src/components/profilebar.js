import { useContext, useState, useEffect } from 'react';
import { Stack, Typography } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import { AppTheme } from '../utils/theme';
import { AppConstants } from '../config/app-config';
import { AppContext } from '../context/app-context';
import { notify } from '../utils';
import { Auth } from 'aws-amplify';
import Header from './header';

export default function ProfileBar() {
    const navigate = useNavigate();
    const { clearAppContext, user, setUser } = useContext(AppContext);

    // const signOut = async () => {
    //     try {
    //       await Auth.signOut();
    //     } catch (error) {
    //       notify(AppConstants.ERROR, error.message);
    //     } finally {
    //       localStorage.clear();
    //       clearAppContext();
    //     }
    //   };


    useEffect(() => {
        (async () => {
            try {
                const { username } = await Auth.currentUserInfo();
                localStorage.setItem("userName", username)
                setUser(localStorage.getItem("userName"));
            } catch (e) {
                notify(AppConstants.ERROR, e.msg);
            }
        })();
    }, []);


    const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 450);
    useEffect(() => {
        const handleResize = () => {
            setIsWideScreen(window.innerWidth > 450);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <Header title={`Welcome, ${user}`} />
    );
}