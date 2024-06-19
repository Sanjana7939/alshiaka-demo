
import axios from "axios";
import { processError } from "./utils";

// Function to map backend status to 'Y' or 'N'
function mapBackendStatus(status) {
  if (status === 1) {
    return "Y";
  } else if (status === 0) {
    return "N";
  } else {
    throw new Error("Invalid status received from backend");
  }
}
/////////////////////////////////////////////////?????????????????????????????????
// export const dashboardDataApi = async () => {
//   try {
//     const response = await axios.get("http://localhost:4500/dashboard");

//     console.log("Fetched Dashboard Data:", response.data); // Log the fetched data
///////////////////////////////////////////////////???????????????????????????????????????
export const dashboardDataApi = async (params) => {
  try {
    // Construct the URL with query parameters
    const url = new URL("http://localhost:4500/dashboard");
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );

    const response = await axios.get(url.toString());
    console.log("Fetched Dashboard Data:", response.data);
///////////////////////////////////////////////////????????????????????????????????????????    
    // Transform the raw data into the required structure
    const rawData = response.data.data[0];
    const totalTransactions = rawData.length;

    // Initialize accumulator with known statuses
    const stats = {
      N: { status: 0, display_status: "Data Not Synced", value: 0 },
      Y: { status: 1, display_status: "Data Synced", value: 0 },
    };

    // Update accumulator values based on rawData
    rawData.forEach((item) => {
      stats[mapBackendStatus(item.status)].value++;
    });

    const dashboardData = {
      container_type: "ALL",
      container_status: "ALL",
      stats: Object.values(stats),
      container_stats: {
        total: totalTransactions,
        pie_stats: Object.values(stats),
      },

      bar_stats: [
        {
          type: "FCL",
          stats: [
            {
              status: "NEW",
              display_status: "New",
              value: 2,
            },
            {
              status: "PLACEMENT_PROVIDED",
              display_status: "Placement Provided",
              value: 6,
            },
            {
              status: "READY_FOR_UNLOADING",
              display_status: "Ready For Unloading",
              value: 3,
            },
            {
              status: "UNLOADING_START",
              display_status: "Unloading Start",
              value: 8,
            },
            {
              status: "CONTAINER_EMPTY",
              display_status: "Empty",
              value: 5,
            },
            {
              status: "CONTAINER_LEFT_DC",
              display_status: "Left DC",
              value: 6,
            },
          ],
        },
        {
          type: "LCL",
          stats: [
            {
              status: "NEW",
              display_status: "New",
              value: 1,
            },
            {
              status: "PLACEMENT_PROVIDED",
              display_status: "Placement Provided",
              value: 2,
            },
            {
              status: "READY_FOR_UNLOADING",
              display_status: "Ready For Unloading",
              value: 3,
            },
            {
              status: "UNLOADING_START",
              display_status: "Unloading Start",
              value: 4,
            },
            {
              status: "CONTAINER_EMPTY",
              display_status: "Empty",
              value: 5,
            },
            {
              status: "CONTAINER_LEFT_DC",
              display_status: "Left DC",
              value: 6,
            },
          ],
        },
      ],
    };

    const data = {
      data: dashboardData,
      message: response.data.msg,
      status: "OK",
    };

    return data;
  } catch (error) {
    console.error("dashboard error:", error);
    processError(error, "Error getting dashboard data");
  }
};
