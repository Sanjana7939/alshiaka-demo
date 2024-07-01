import axios from "axios";
import { processError } from "./utils";
//Imports the axios library for making HTTP requests and the processError function from a local "./utils" module.
const display_attribute = [
  "store_no",
  "reg_no",
  "status",
  "store_business_date",
  "store_trans_no",
  "xcenter_business_date",
  "xcenter_trans_no",
  "runtime",
];
//Defines an array display_attribute containing the names of attributes to be displayed.
const display_name = {
  store_no: "Store No",
  reg_no: "Reg No",
  status: "Status",
  store_business_date: "Store Business Date",
  store_trans_no: "Current Store Trans No",
  xcenter_business_date: "Xcenter Sync Business Date",
  xcenter_trans_no: "Xcenter Trans No",
  runtime: "Runtime",
};
//Defines an object display_name mapping attribute names to their display names.
const status_attributes = {
  N: {
    description: "Data Not Synced",
    color: "red",
  },
  Y: {
    description: "Data Synced",
    color: "green",
  },
};
//Defines an object status_attributes mapping status values ("N" and "Y") to their descriptions and colors.
function mapBackendStatus(status) {
  if (status === 1) {
    return "Y";
  } else if (status === 0) {
    return "N";
  } else {
    throw new Error("Invalid status received from backend");
  }
}
//Defines a function mapBackendStatus to convert backend status values (0 and 1) to human-readable status values ("N" and "Y").

export const listData = async (filterStatus) => {
  try {
    const response = await axios.get(
      `http://localhost:4500/data${
        filterStatus ? `?status=${filterStatus}` : ""
      }`
    );
    console.log("Fetched Data:", response.data); // Log the fetched data
    //Defines an async function listData that fetches data from an API based on a filter status.
    // It constructs the URL with the filter status if provided and makes an HTTP GET request to fetch the data.

    const transformedData = response.data.data[0].map((item) => {
      return {
        store_no: item.store_no,
        reg_no: item.reg_no,
        status: mapBackendStatus(item.status),
        store_business_date: new Date(
          item.store_business_date
        ).toLocaleDateString(),
        store_trans_no: item.store_trans_no,
        xcenter_business_date: new Date(
          item.xcenter_business_date
        ).toLocaleDateString(),
        xcenter_trans_no: item.xcenter_trans_no,
        runtime: "runtime",
      };
    });
    //Logs the fetched data and maps the fetched data into a transformed format suitable for display.
    //It uses mapBackendStatus to convert status values and, formats dates.
    const data = {
      display_attribute,
      display_name,
      status_attributes,
      transfers: transformedData,
      message: response.data.msg,
      status: "OK",
    };
    return data;
// Creates an object data that encapsulates the processed data and metadata.
// display_attribute, display_name, and status_attributes are included as part of the structured data.
// transfers holds the transformed data ready for display.
// message is populated with a message extracted from the response data.
// status: "OK" indicates the success status of the data retrieval.

  } catch (error) {
    console.error("listData error:", error.response);
    const errorMessage = "Error fetching data";
    processError(error, errorMessage);
    //Logs the error message along with the error response (if available).
    //Calls the processError function to handle the error with a custom error message.

    const errorData = {
      display_attribute,
      display_name,
      status_attributes,
      transfers: [],
      message: errorMessage,
      status: "Failed",
    };
    //errorData object with the same structure as data but with specific error handling details
    throw errorData;
  }
};
