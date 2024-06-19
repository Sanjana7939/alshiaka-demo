import axios from "axios";
import { processError } from "./utils";

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

function mapBackendStatus(status) {
  if (status === 1) {
    return "Y";
  } else if (status === 0) {
    return "N";
  } else {
    throw new Error("Invalid status received from backend");
  }
}

export const listData = async (filterStatus) => {
  try {
    const response = await axios.get(
      `http://localhost:4500/data${
        filterStatus ? `?status=${filterStatus}` : ""
      }`
    );
    console.log("Fetched Data:", response.data); // Log the fetched data

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

    const data = {
      display_attribute,
      display_name,
      status_attributes,
      transfers: transformedData,
      message: response.data.msg,
      status: "OK",
    };
    return data;
  } catch (error) {
    console.error("listData error:", error.response);
    const errorMessage = "Error fetching data";
    processError(error, errorMessage);

    const errorData = {
      display_attribute,
      display_name,
      status_attributes,
      transfers: [],
      message: errorMessage,
      status: "Failed",
    };

    throw errorData;
  }
};
