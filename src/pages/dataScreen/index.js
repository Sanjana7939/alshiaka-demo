import React, { useContext, useEffect } from "react";
import { Stack } from "@mui/material";
import DataScreenTable from "../../components/dataScreen/table";
import { ShipmentManagementContext } from "../../context/ShipmentManagementContext";
import LinearProgressSkeleton from "../../components/loadingScreens";
import ResponsiveAppBar from "../../components/appBar";
import { useNavigate } from "react-router-dom"; // Import useNavigate

//DataScreen component is defined as a functional component
const DataScreen = () => {
  const {
    isContainersLoading,
    requestLoading,
    setIsContainersLoading,
    setRequestLoading,
  } = useContext(ShipmentManagementContext); //useContext hook to access the ShipmentManagementContext and retrieve the necessary state values and functions
  const searchParams = new URLSearchParams(window.location.search); // extracts the status query parameter from the URL using new URLSearchParams(window.location.search).
  const status = searchParams.get("status");

  //useEffect hook to fetch data when the status parameter changes
  useEffect(() => {
    //   navigate(`/data?status=${status}`);
    // }, [status, navigate]);
    (async () => {
      try {
        setIsContainersLoading(true); //to indicate that data is being fetched
        const response = await listData(status); //to fetch the data
        if (response) {
          // Handle response here
          setContainersList(response.data); //If the response is successful, it sets the containersList state with the response data
        }
      } catch (error) {
        // Handle error here
        console.error("Error fetching data:", error);
      } finally {
        //sets the isContainersLoading and requestLoading states to false to indicate that the data fetching process is complete.
        setIsContainersLoading(false);
        setRequestLoading(false);
      }
    })();
  }, [status]); //useEffect hook to fetch data when the status parameter changes
  return (
    <Stack
      direction="column"
      sx={{
        position: "relative",
        width: "100%",
        alignItems: "center",
        overflowX: "hidden",
        overflowY: "auto",
        rowGap: "4px",
      }}
    >
      {(isContainersLoading || requestLoading) && <LinearProgressSkeleton />}
      {/* displays a linear progress bar to indicate that data is being loaded. */}
      <ResponsiveAppBar title="Data" />
      {/* provides a responsive header for the application. */}
      <DataScreenTable />
      {/* responsible for rendering the data table */}
    </Stack>
  );
};

export default DataScreen;
