import React from "react";
import { Grid, Stack } from "@mui/material";
import BasicBars from "../../components/dashboard/barplot";
import { CircularProgress } from "@mui/material";
import { AppContext } from "../../context/app-context";
import { useContext, useEffect, useState } from "react";
import Search from "../../components/dashboard/search";
import { dashboardDataApi } from "../../api/dashboardApi";
import { notify } from "../../utils";
import { AppConstants } from "../../config/app-config";
import PieChart from "../../components/dashboard/pieplot";
import StatusCounts from "../../components/dashboard/statuscounts";
import ResponsiveAppBar from "../../components/appBar";
import dayjs from "dayjs";
//////////?????????????????????????????/////////////////////////?????????????????????????????????
import FilteredTable from "../../components/dashboard/FilteredTable";
////////////////////////////////////////////////////////////////////?????????????????????????????//

const getStartTimeUTC = (_date) => {
  console.log("getStartTimeUTC======", _date);
  const dateString = _date.format("YYYY-MM-DD") + " 00:00:00";
  const dateTime = dayjs(dateString).tz(AppConstants.TIMEZONE, true);
  return dateTime.utc().valueOf();
};

const getEndTimeUTC = (_date) => {
  console.log("getEndTimeUTC======", _date);
  const dateString = _date.format("YYYY-MM-DD") + " 23:59:59";
  const dateTime = dayjs(dateString).tz(AppConstants.TIMEZONE, true);
  return dateTime.utc().valueOf();
};

const checkDatesValid = (startDate, endDate) => {
  const startUTC = getStartTimeUTC(startDate);
  const endUTC = getEndTimeUTC(endDate);
  if (startUTC >= endUTC) {
    throw "Start date should be less than End date";
  }
  ////Validates that the start date is before the end date.
  ////Ensures the date range does not exceed 31 days.
  ////Throws errors if any of these conditions are not met.

  // Calculate the difference in milliseconds
  const timeDifference = endUTC - startUTC;
  // Calculate the number of days in the difference
  const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
  if (daysDifference > 31) {
    throw "Start date and End date should be max 30 days apart";
  }
};

export default function Dashboard() {
  const {
    status,
    category,
    startDate,
    endDate,
    dashboardLoading,
    setDashboardLoading,
    dashboardData,
    setDashboardData,
  } = useContext(AppContext);

  useEffect(() => {
    (async () => {
      try {
        checkDatesValid(startDate, endDate);

        if (dashboardLoading) {
          const data = {
            /////////////////////////////////////////////////???????????????????????????????????????????
            //   containerStatus: status,
            // containerType: category,
            // // "startDate": 1704070800000,
            // // "endDate": 1709254800000,
            // startDate: getStartTimeUTC(startDate),
            // endDate: getEndTimeUTC(endDate),
            // placementProvidedDate: getStartTimeUTC(
            //   dayjs().tz(AppConstants.TIMEZONE)
            // ),
            // placementProvidedDays: 6,
            // };
            ////////////////////////////////////////////////////????????????????????????????????????????????????????
            status,
            storeNo: category,
            startDate: startDate.format("YYYY-MM-DD"),
            endDate: endDate.format("YYYY-MM-DD"),
          };
          //////////////////////////////////////////////////////>?????????????????????????????????????????????????
          console.log("Dashboard REQUES", data);
          const response = await dashboardDataApi(data); ////////Calls dashboardDataApi to fetch the data and sets it in context.
          setDashboardData(response.data);
        }
        ////////Checks date validity using checkDatesValid.
        ///Constructs the data object for API request.
        ////Calls dashboardDataApi to fetch the data and sets it in context.
        ////Handles exceptions and sets the loading status to false.
      } catch (e) {
        notify(AppConstants.ERROR, e);
        setDashboardData();
      } finally {
        if (dashboardLoading) {
          setDashboardLoading(false);
        }
      }
    })();
  }, [dashboardLoading]);

  return (
    <Stack
      sx={{
        width: "100%",
        alignItems: "center",
        rowGap: 1,
        overflowX: "hidden",
        overflowY: "auto",
        "&::-webkit-scrollbar": { width: "4px" },
        "&::-webkit-scrollbar-thumb": { backgroundColor: "#4870D6" },
      }}
    >
      <ResponsiveAppBar title="Dashboard" />
      <Search />
      {/* /////////////////////////////////////////////////////////??????????????????????????????????? */}
      {/*<DataScreenTable /> {/* Add this line to display the filtered table */}
      {/* /////////////////////////////////////////////////////////????????????????????????????????????? */}
      {!dashboardLoading ? (
        dashboardData ? (
          <>
            <Summary
              barData={dashboardData?.bar_stats}
              pieStats={dashboardData?.container_stats.pie_stats}
              statusCount={dashboardData?.stats}
              totalContainers={dashboardData?.container_stats.total}
              placementProvidedData={dashboardData.placementProvidedData}
            />
            <FilteredTable filteredData={dashboardData.data} />
          </> ///////////////Summary is displayed when dashboardData exists and loading is complete.
        ) : null
      ) : (
        <InProgress /> ////////InProgress shows a loading spinner when data is being fetched.
      )}
    </Stack>
  );
}

export const Summary = ({
  barData,
  pieStats,
  statusCount,
  totalContainers,
  placementProvidedData,
}) => {
  const pieChartData = Object.values(pieStats).map((item) => ({
    display_status: item && item.display_status ? item.display_status : "N/A",
    value:
      item && item.value !== undefined && item.value !== null ? item.value : 0,
  }));

  return (
    <Stack sx={{ width: "100%", alignItems: "center", pb: "2vh", rowGap: 1 }}>
      <StatusCounts statusCount={statusCount} />
      {barData && pieStats ? (
        <Stack alignItems="center" width="100%">
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            rowGap="5px"
            columns={2}
            sx={{ "& > *": { padding: 2 } }}
          >
            <Grid item xs={2} md={1} lg={1}>
              <PieChart data={pieChartData} totalContainers={totalContainers} />
            </Grid>
            <Grid item xs={2} md={1} lg={1}>
              <BasicBars data={barData} />
            </Grid>
          </Grid>
        </Stack>
      ) : (
        <InProgress />
      )}
    </Stack>
  );
};

export const InProgress = () => (
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
