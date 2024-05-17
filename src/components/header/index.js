import { useState, useEffect } from 'react';
import { Stack, Typography } from "@mui/material";
import { AppTheme } from '../../utils/theme';

export default function Header({ title }) {
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
        <Stack
            direction="row"
            justifyContent="space-between"
            sx={{
                backgroundColor: AppTheme.secondary,
                borderBottom: `4px solid ${AppTheme.border}`,
                columnGap: '4', width: '100%',
            }}>

            <Stack direction="row" alignItems="center" sx={{ padding: '8px 5px' }}>
                <Typography
                    variant="h4"
                    sx={{
                        whiteSpace: 'nowrap', marginLeft: '8px',
                        fontSize: '22px', color: AppTheme.fontColor
                    }}>
                   {title}
                </Typography>
            </Stack>
        </Stack>
    );
}