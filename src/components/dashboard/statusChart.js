import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Stack, Typography } from "@mui/material";
import { AppTheme } from '../../utils/theme';

export default function StatusChart() {
    let xLabel = ['a', 'b', 'c', 'd', 'e', 'e'];
    let countData = [1, 2, 3, 4, 5, 6]
    let colors = [AppTheme['FCL_COLOR'], AppTheme['LCL_COLOR']];
    
    return (
        <Stack
            backgroundColor={AppTheme.secondary}
            border={`1px solid ${AppTheme.border}`}
            alignItems='center'
            justifyContent='center'
            borderRadius='10px'
            width="100%"
            rowGap='1vh'
            pt="2vh"
        >
            <Typography sx={{ fontSize: 20, fontWeight: 'bold', color: '#3f3f3f', textAlign: 'center', mb: 1 }}>
                Stores per STATUS
            </Typography>

            <BarChart
                xAxis={[{ scaleType: 'band', data: xLabel }]}
                series={[
                    { data: countData },
                ]}
                yAxis={[{ label: 'Containers Count' }]}
                height={320}
            />
        </Stack>
    );
}