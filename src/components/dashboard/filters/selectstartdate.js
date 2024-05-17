import { useEffect } from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useContext } from 'react';
import { AppContext } from '../../../context/app-context';
import { Stack } from '@mui/material';
import dayjs from 'dayjs';
import { AppConstants } from '../../../config/app-config';


export default function SelectStartDate() {
    const { startDate, setStartDate } = useContext(AppContext);
    
    return (
        <Stack sx={{ alignItems: 'center' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>

                    <DatePicker
                        label="Start Date"
                        value={dayjs(startDate)}
                        format="DD-MM-YYYY"
                        onChange={(newValue) => setStartDate(dayjs(newValue).tz(AppConstants.TIMEZONE))}
                        sx={{ width: '200px' }}
                        slotProps={{ textField: { size: 'small' } }}
                        timezone={AppConstants.TIMEZONE}
                    />
                </DemoContainer>
            </LocalizationProvider>
        </Stack>
    );
}
