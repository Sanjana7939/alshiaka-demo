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
import FilteredTable from "../../components/dashboard/FilteredTable";

//getStartTimeUTC & getEndTimeUTC: Converts the given date (_date) to start (00:00:00) and end (23:59:59) times in UTC.
const getStartTimeUTC = (_date) => {
  // Logging the start time in UTC for debugging.
  console.log("getStartTimeUTC======", _date);
  const dateString = _date.format("YYYY-MM-DD") + " 00:00:00";
  const dateTime = dayjs(dateString).tz(AppConstants.TIMEZONE, true);
  return dateTime.utc().valueOf();
};

const getEndTimeUTC = (_date) => {
  // Logging the end time in UTC for debugging.
  console.log("getEndTimeUTC======", _date);
  const dateString = _date.format("YYYY-MM-DD") + " 23:59:59";
  const dateTime = dayjs(dateString).tz(AppConstants.TIMEZONE, true);
  return dateTime.utc().valueOf();
};

// Validates the date range
const checkDatesValid = (startDate, endDate) => {
  const startUTC = getStartTimeUTC(startDate);
  const endUTC = getEndTimeUTC(endDate);
  if (startUTC >= endUTC) {
    // Ensures the start date is before the end date.
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

// Main Dashboard component
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
  } = useContext(AppContext); // Uses the useContext hook to access the AppContext and retrieve various state values

  useEffect(() => {
    // useEffect hook to fetch the dashboard data when the dashboardLoading state changes.
    (async () => {
      try {
        checkDatesValid(startDate, endDate); // Checks the validity of the date range

        if (dashboardLoading) {
          //constructs a data object with the necessary parameters and logs it to the console.
          const data = {
            status,
            storeNo: category,
            startDate: startDate.format("YYYY-MM-DD"),
            endDate: endDate.format("YYYY-MM-DD"),
          };
          console.log("Dashboard REQUEST", data); // Logging the data object for API request
          const response = await dashboardDataApi(data); // Calls dashboardDataApi to fetch the data and sets it in context.
          console.log("Dashboard Response", response); // Logging the API response
          setDashboardData(response.data); // Sets the response data in the dashboardData state
        }
        ////Checks date validity using checkDatesValid.
        ////Constructs the data object for API request.
        ////Calls dashboardDataApi to fetch the data and sets it in context.
        ////Handles exceptions and sets the loading status to false.
      } catch (e) {
        notify(AppConstants.ERROR, e); // Notifies the user in case of errors
        setDashboardData(); // Clears the dashboardData state
      } finally {
        if (dashboardLoading) {
          setDashboardLoading(false); // Sets the loading status to false
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

      {/* Uncomment the line below to display the FilteredTable component above the pie */}
      {/* <FilteredTable /> */}

      {!dashboardLoading ? (
        dashboardData ? (
          <>
            <Summary
              barData={dashboardData?.bar_stats}
              pieStats={dashboardData?.container_stats.pie_stats}
              statusCount={dashboardData?.stats}
              totalContainers={dashboardData?.container_stats.total}
              placementProvidedData={dashboardData.placementProvidedData}
            />{" "}
            {console.log(
              "Dashboard Data Passed to FilteredTable",
              dashboardData.data
            )}
            {/* // Summary component is displayed when dashboardData exists and
            loading is complete. */}
            <FilteredTable filteredData={dashboardData.data} />
          </>
        ) : null
      ) : (
        <InProgress /> // Shows a loading spinner when data is being fetched.
      )}
    </Stack>
  );
}

// Summary component that displays various data visualizations
export const Summary = ({
  barData,
  pieStats,
  statusCount,
  totalContainers,
  placementProvidedData,
}) => {
  // Transforming pieStats data into a format suitable for PieChart component
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

// Component to display a loading indicator
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
