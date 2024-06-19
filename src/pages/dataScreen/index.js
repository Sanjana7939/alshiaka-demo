import React, { useContext, useEffect } from "react";
import { Stack } from "@mui/material";
import DataScreenTable from "../../components/dataScreen/table";
import { ShipmentManagementContext } from "../../context/ShipmentManagementContext";
import LinearProgressSkeleton from "../../components/loadingScreens";
import ResponsiveAppBar from "../../components/appBar";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const DataScreen = () => {
  const {
    isContainersLoading,
    requestLoading,
    setIsContainersLoading,
    setRequestLoading,
  } = useContext(ShipmentManagementContext);
  const searchParams = new URLSearchParams(window.location.search);
  const status = searchParams.get("status");

  useEffect(() => {
    //   navigate(`/data?status=${status}`);
    // }, [status, navigate]);
    (async () => {
      try {
        setIsContainersLoading(true);
        const response = await listData(status);
        ////////////////______
        if (response) {
          // Handle response here
          setContainersList(response.data);
        }
        ///////////______________
      } catch (error) {
        // Handle error here
        ////________
        console.error("Error fetching data:", error);
      } finally {
        setIsContainersLoading(false);
        setRequestLoading(false);
      }
    })();
  }, [status]);
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
      <ResponsiveAppBar title="Data" />
      <DataScreenTable />
    </Stack>
  );
};

export default DataScreen;
