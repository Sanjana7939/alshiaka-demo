import { endpoints } from "../config/app-config";
import axios from "axios";
import { createAuthenticationHeaderForApi } from "./groupHandlers";
import { processError } from "./utils";

const dashData = {
  "container_type": "ALL",
  "container_status": "ALL",
  "stats": [
    {
      "status": "NEW",
      "display_status": "New",
      "value": 2
    },
    {
      "status": "PLACEMENT_PROVIDED",
      "display_status": "Placement Provided",
      "value": 10
    },
    {
      "status": "READY_FOR_UNLOADING",
      "display_status": "Ready For Unloading",
      "value": 6
    },
    {
      "status": "UNLOADING_START",
      "display_status": "Unloading Start",
      "value": 8
    },
    {
      "status": "CONTAINER_EMPTY",
      "display_status": "Empty",
      "value": 10
    },
    {
      "status": "CONTAINER_LEFT_DC",
      "display_status": "Left DC",
      "value": 12
    }
  ],
  "container_stats": {
    "total": 42,
    "pie_stats": [
      {
        "status": "FLC",
        "display_status": "FCL",
        "value":21
      },
      {
        "status": "LLC",
        "display_status": "LCL",
        "value": 21
      }
    ]
  },
  "bar_stats": [
    {
      "type": "FCL",
      "stats": [
        {
          "status": "NEW",
          "display_status": "New",
          "value": 2
        },
        {
          "status": "PLACEMENT_PROVIDED",
          "display_status": "Placement Provided",
          "value": 6
        },
        {
          "status": "READY_FOR_UNLOADING",
          "display_status": "Ready For Unloading",
          "value": 3
        },
        {
          "status": "UNLOADING_START",
          "display_status": "Unloading Start",
          "value": 8
        },
        {
          "status": "CONTAINER_EMPTY",
          "display_status": "Empty",
          "value": 5
        },
        {
          "status": "CONTAINER_LEFT_DC",
          "display_status": "Left DC",
          "value": 6
        }
      ]
    },
    // {
    //   "type": "LCL",
    //   "stats": [
    //     {
    //       "status": "NEW",
    //       "display_status": "New",
    //       "value": 1
    //     },
    //     {
    //       "status": "PLACEMENT_PROVIDED",
    //       "display_status": "Placement Provided",
    //       "value": 2
    //     },
    //     {
    //       "status": "READY_FOR_UNLOADING",
    //       "display_status": "Ready For Unloading",
    //       "value": 3
    //     },
    //     {
    //       "status": "UNLOADING_START",
    //       "display_status": "Unloading Start",
    //       "value": 4
    //     },
    //     {
    //       "status": "CONTAINER_EMPTY",
    //       "display_status": "Empty",
    //       "value": 5
    //     },
    //     {
    //       "status": "CONTAINER_LEFT_DC",
    //       "display_status": "Left DC",
    //       "value": 6
    //     }
    //   ]
    // }
  ]
}

export const dashboard = async (data) => {
  try {
    const headers = await createAuthenticationHeaderForApi();
    const response = await axios.post(`${endpoints.dashboard}`, data, headers);
    if (response.data) {
      console.log('dashboard api', response.data)
      return response.data;
    }
    throw new Error("ERR_CONNECTION_REFUSED");
  } catch (error) {
    console.error("dashboard error:", error.response);
    processError(error, 'Error getting dashboard data')
  }
};
