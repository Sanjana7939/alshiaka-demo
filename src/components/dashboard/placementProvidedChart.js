import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Stack, Typography } from "@mui/material";
import { AppTheme } from "../../utils/theme";
import { getUAEDate } from "../../utils/shipmentManagement";

export default function PlacementProvidedChart({ data }) {
  let xLabel = [];
  let fclCount = [];
  let lclCount = [];
  let colors = [AppTheme["FCL_COLOR"], AppTheme["LCL_COLOR"]];

  for (const [key, value] of Object.entries(data)) {
    xLabel.push(getUAEDate(value["timestamp"]));
    fclCount.push(value["FCL"]);
    lclCount.push(value["LCL"]);
  }

  return (
    <Stack
      backgroundColor={AppTheme.secondary}
      border={`1px solid ${AppTheme.border}`}
      alignItems="center"
      justifyContent="center"
      borderRadius="10px"
      width="100%"
      rowGap="1vh"
      pt="2vh"
    >
      <Typography
        sx={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#3f3f3f",
          textAlign: "center",
          mb: 1,
        }}
      >
        Placement Provided
      </Typography>

      <BarChart
        xAxis={[{ scaleType: "band", data: xLabel }]}
        series={[
          { data: fclCount, stack: "Type", label: "FCL" },
          { data: lclCount, stack: "Type", label: "LCL" },
        ]}
        yAxis={[{ label: "Containers" }]}
        colors={colors}
        height={320}
      />
    </Stack>
  );
}
