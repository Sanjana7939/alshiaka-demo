import { useEffect } from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useContext } from 'react';
import { AppContext } from '../../../context/app-context';
import { Stack } from '@mui/material';
import dayjs from 'dayjs';
import useBreakpoints from '../../useBreakPoints';
import { AppConstants } from '../../../config/app-config';

export default function SelectEndDate() {
    const { endDate, setEndDate } = useContext(AppContext);
    const { isXs, isSm, isMd, isLg, isXl } = useBreakpoints();
    
    return (
        <Stack style={{ alignItems: 'center' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs} >
                <DemoContainer components={['DatePicker']} >
                    <DatePicker
                        label="End Date"
                        value={dayjs(endDate)}
                        format="DD-MM-YYYY"
                        onChange={(newValue) => setEndDate(dayjs(newValue).tz(AppConstants.TIMEZONE))}
                        sx={{ width: '200px' }}
                        slotProps={{ textField: { size: 'small' } }}
                        timezone={AppConstants.TIMEZONE}
                    />
                    
                </DemoContainer>
            </LocalizationProvider>
        </Stack>
    );
    
}

