// import axios from "axios";
// import { processError } from "./utils";
// //These lines import the Axios library for making HTTP requests and a processError function from a local utils module to handle errors.

// // Function to map backend status to 'Y' or 'N'
// function mapBackendStatus(status) {
//   if (status === 1) {
//     return "Y";
//   } else if (status === 0) {
//     return "N";
//   } else {
//     throw new Error("Invalid status received from backend");
//   }
// }
// /////////////////////////////////////////////////?????????????????????????????????
// // export const dashboardDataApi = async () => {
// //   try {
// //     const response = await axios.get("http://localhost:4500/dashboard");

// //     console.log("Fetched Dashboard Data:", response.data); // Log the fetched data
// ///////////////////////////////////////////////////???????????????????????????????????????
// //Asynchronous Function for Fetching Dashboard Data
// export const dashboardDataApi = async (params) => {
//   try {
//     // Construct the URL with query parameters
//     const url = new URL("http://localhost:4500/dashboard");
//     Object.keys(params).forEach((key) =>
//       url.searchParams.append(key, params[key])
//     );
//     //This constructs the complete URL for the API endpoint, including query parameters passed as params.

//     const response = await axios.get(url.toString());
//     console.log("Fetched Dashboard Data:", response.data);
//     //The code makes an HTTP GET request to the constructed URL and logs the fetched data.
//     ///////////////////////////////////////////////////????????????????????????????????????????
//     // Transform the raw data into the required structure
//     const rawData = response.data.data[0];
//     ///////////////////////////////////////////////////????????????????????????????????????????/////////////////
//     if (!rawData || !Array.isArray(rawData)) {
//       throw new Error("Invalid response structure from backend");
//     }
//     //This code snippet ensures that the response data from the backend is in the expected structure
//     ///////////////////////////////////////////////////????????????????????????????????????????////////////////////
//     const totalTransactions = rawData.length;
//     //calculates the total number of transactions based on the length of the rawData array
//     // Initialize accumulator with known statuses
//     const stats = {
//       N: { status: 0, display_status: "Data Not Synced", value: 0 },
//       Y: { status: 1, display_status: "Data Synced", value: 0 },
//     };
//     //An accumulator stats object is initialized with default values for "Data Not Synced" and "Data Synced".
//     //The code then iterates through each item in rawData, maps its status using the mapBackendStatus function, and increments the corresponding value in the stats object.
//     // Update accumulator values based on rawData
//     rawData.forEach((item) => {
//       stats[mapBackendStatus(item.status)].value++;
//     });

//     const dashboardData = {
//       container_type: "ALL",
//       container_status: "ALL",
//       stats: Object.values(stats),
//       container_stats: {
//         total: totalTransactions,
//         pie_stats: Object.values(stats),
//         //////////////////////////////////////////////////////////////////////////???????????????????///////////////////
//         data: rawData,
//         //////////////////////////////////////////////////////////////////////////???????????????????///////////////////
//       },
//       ///constructs the dashboardData object in a structured format, including statistics for different container types and statuses

//       bar_stats: [
//         {
//           type: "FCL",
//           stats: [
//             {
//               status: "NEW",
//               display_status: "New",
//               value: 2,
//             },
//             {
//               status: "PLACEMENT_PROVIDED",
//               display_status: "Placement Provided",
//               value: 6,
//             },
//             {
//               status: "READY_FOR_UNLOADING",
//               display_status: "Ready For Unloading",
//               value: 3,
//             },
//             {
//               status: "UNLOADING_START",
//               display_status: "Unloading Start",
//               value: 8,
//             },
//             {
//               status: "CONTAINER_EMPTY",
//               display_status: "Empty",
//               value: 5,
//             },
//             {
//               status: "CONTAINER_LEFT_DC",
//               display_status: "Left DC",
//               value: 6,
//             },
//           ],
//         },
//         {
//           type: "LCL",
//           stats: [
//             {
//               status: "NEW",
//               display_status: "New",
//               value: 1,
//             },
//             {
//               status: "PLACEMENT_PROVIDED",
//               display_status: "Placement Provided",
//               value: 2,
//             },
//             {
//               status: "READY_FOR_UNLOADING",
//               display_status: "Ready For Unloading",
//               value: 3,
//             },
//             {
//               status: "UNLOADING_START",
//               display_status: "Unloading Start",
//               value: 4,
//             },
//             {
//               status: "CONTAINER_EMPTY",
//               display_status: "Empty",
//               value: 5,
//             },
//             {
//               status: "CONTAINER_LEFT_DC",
//               display_status: "Left DC",
//               value: 6,
//             },
//           ],
//         },
//       ],
//     };

//     const data = {
//       data: dashboardData,
//       message: response.data.msg,
//       status: "OK",
//     };
//     //constructs a response object data containing the processed dashboardData, a message from the response, and a status flag.
//     //This object is returned by the function.
//     return data;
//   } catch (error) {
//     console.error("dashboard error:", error);
//     processError(error, "Error getting dashboard data");
//   }
// };


import axios from "axios";
import { processError } from "./utils";
//These lines import the Axios library for making HTTP requests and a processError function from a local utils module to handle errors.

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

//Asynchronous Function for Fetching Dashboard Data
export const dashboardDataApi = async (params) => {
  try {
    // Construct the URL with query parameters
    const url = new URL("http://localhost:4500/dashboard");
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );
    //This constructs the complete URL for the API endpoint, including query parameters passed as params.

    const response = await axios.get(url.toString());
    console.log("Fetched Dashboard Data:", response.data);
    //The code makes an HTTP GET request to the constructed URL and logs the fetched data.
    // Transform the raw data into the required structure
    const rawData = response.data.data[0];
    if (!rawData || !Array.isArray(rawData)) {
      throw new Error("Invalid response structure from backend");
    }
    //This code snippet ensures that the response data from the backend is in the expected structure
    const totalTransactions = rawData.length;
    //calculates the total number of transactions based on the length of the rawData array
    // Initialize accumulator with known statuses
    const stats = {
      N: { status: 0, display_status: "Data Not Synced", value: 0 },
      Y: { status: 1, display_status: "Data Synced", value: 0 },
    };
    //An accumulator stats object is initialized with default values for "Data Not Synced" and "Data Synced".
    //The code then iterates through each item in rawData, maps its status using the mapBackendStatus function, and increments the corresponding value in the stats object.
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
        data: rawData,
      },
      ///constructs the dashboardData object in a structured format, including statistics for different container types and statuses

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
    //constructs a response object data containing the processed dashboardData, a message from the response, and a status flag.
    //This object is returned by the function.
    return data;
  } catch (error) {
    console.error("dashboard error:", error);
    processError(error, "Error getting dashboard data");
  }
};
