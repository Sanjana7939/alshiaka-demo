import React from 'react';
import { Grid, Stack, Typography } from "@mui/material";
import BasicBars from '../../components/dashboard/barplot';
import { CircularProgress } from '@mui/material';
import { AppContext } from '../../context/app-context';
import { useContext, useEffect, useState } from 'react';
import ProfileBar from "../../components/profilebar";
import Search from "../../components/dashboard/search";
import { dashboard, allstatus } from "../../api/dashboard";
import { notify, checkRoleAccess } from "../../utils";
import { AppConstants } from "../../config/app-config";
import PieChart from '../../components/dashboard/pieplot'
import StatusCounts from "../../components/dashboard/statuscounts";
import ResponsiveAppBar from '../../components/appBar';
import AccessDenied from '../../components/accessDenied';
import dayjs from 'dayjs';
import PlacementProvidedChart from '../../components/dashboard/placementProvidedChart';
import StatusChart from '../../components/dashboard/statusChart';

const getStartTimeUTC = (_date) => {
    console.log('getStartTimeUTC======', _date)
    const dateString = _date.format('YYYY-MM-DD') + ' 00:00:00';
    const dateTime = dayjs(dateString).tz(AppConstants.TIMEZONE, true);
    return dateTime.utc().valueOf();
}

const getEndTimeUTC = (_date) => {
    console.log('getEndTimeUTC======', _date)
    const dateString = _date.format('YYYY-MM-DD') + ' 23:59:59';
    const dateTime = dayjs(dateString).tz(AppConstants.TIMEZONE, true);
    return dateTime.utc().valueOf();
}

const checkDatesValid = (startDate, endDate) => {
    const startUTC = getStartTimeUTC(startDate);
    const endUTC = getEndTimeUTC(endDate);
    if (startUTC >= endUTC) {
        throw 'Start date should be less than End date';
    }

    // Calculate the difference in milliseconds
    const timeDifference = endUTC - startUTC;
    // Calculate the number of days in the difference
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
    if (daysDifference > 31) {
        throw 'Start date and End date should be max 30 days apart';
    }
}

export default function Dashboard() {
    const userPermissions = checkRoleAccess('DASHBOARD');

    const { status, category, 
        startDate, endDate,
        dashboardLoading, setDashboardLoading, 
        dashboardData, setDashboardData
    } = useContext(AppContext);

    useEffect(() => {
        (async () => {
            try {
                checkDatesValid(startDate, endDate);

                if (dashboardLoading) {
                    const data = {
                        containerStatus: status,
                        containerType: category,
                        // "startDate": 1704070800000,
                        // "endDate": 1709254800000,
                        startDate: getStartTimeUTC(startDate),
                        endDate: getEndTimeUTC(endDate),
                        placementProvidedDate: getStartTimeUTC(dayjs().tz(AppConstants.TIMEZONE)),
                        placementProvidedDays: 6,
                    };
                    console.log("Dashboard REQUES", data);
                    const response = await dashboard(data);
                    setDashboardData(response.data);
                }
            } catch (e) {
                notify(AppConstants.ERROR, e);
                setDashboardData();
            } finally {
                if (dashboardLoading) {
                    setDashboardLoading(false);
                }
            }
        })()
    }, [dashboardLoading]);

    if (!userPermissions.read) {
        return <AccessDenied />;
    }

    return (
        <Stack sx={{ width: "100%", alignItems: "center", rowGap: 1, overflowX: 'hidden', overflowY: 'auto', '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#4870D6' } }}>
            <ResponsiveAppBar title='Dashboard' />
            <Search />

            {!dashboardLoading ? (dashboardData ? (
                <Summary
                    barData={dashboardData?.bar_stats}
                    pieStats={dashboardData?.container_stats.pie_stats}
                    statusCount={dashboardData?.stats}
                    totalContainers={dashboardData?.container_stats.total}
                    placementProvidedData={dashboardData.placementProvidedData}
                />
            ) : null) : (
                <InProgress />
            )}

        </Stack>
    )
}

export const Summary = ({ barData, pieStats, statusCount, totalContainers, placementProvidedData }) => {
    const pieChartData = Object.values(pieStats).map(item => ({
        display_status: item && item.display_status ? item.display_status : 'N/A',
        value: item && item.value !== undefined && item.value !== null ? item.value : 0,
    }));

    return (
        <Stack sx={{ width: '100%', alignItems: 'center', pb: '2vh', rowGap: 1 }}>
            <StatusCounts statusCount={statusCount} />
            {barData && pieStats ? (
                <Stack alignItems="center" width="100%">
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        rowGap="5px"
                        columns={2}
                        sx={{ '& > *': { padding: 2 } }}
                    >
                        <Grid item xs={2} md={1} lg={1}>
                            <PieChart data={pieChartData} totalContainers={totalContainers} />
                        </Grid>
                        <Grid item xs={2} md={1} lg={1}>
                            <PlacementProvidedChart data={placementProvidedData} />
                        </Grid>
                        <Grid item xs={2} md={1} lg={1}>
                            <BasicBars data={barData} />
                        </Grid>
                        {/* <Grid item xs={2} md={1} lg={1}>
                            <StatusChart data={barData} />
                        </Grid> */}

                    </Grid>
                </Stack>
            ) : (
                <InProgress />
            )}
        </Stack>
    );
};


export const InProgress = () => (
    <Stack sx={{
        width: "100%",
        padding: ' 0 0 3vh 0',
        justifyContent: 'center',
        alignItems: 'center',
        rowGap: '16px',
        columnGap: '16px',
        height: '100vh'
    }} >
        <CircularProgress />
    </Stack>
)