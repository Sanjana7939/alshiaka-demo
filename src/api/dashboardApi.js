import axios from "axios";
import { processError } from "./utils";

const DELAY = 500;

const dashData = {
    "container_type": "ALL",
    "container_status": "ALL",
    "stats": [
      {
        "status": "Y",
        "display_status": "Data Synced",
        "value": 2
      },
      {
        "status": "N",
        "display_status": "Data Not Synced",
        "value": 10
      },
    ],
    "container_stats": {
      "total": 42,
      "pie_stats": [
        {
          "status": "Y",
          "display_status": "Data Synced",
          "value":21
        },
        {
          "status": "N",
          "display_status": "Data Not Synced",
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
      {
        "type": "LCL",
        "stats": [
          {
            "status": "NEW",
            "display_status": "New",
            "value": 1
          },
          {
            "status": "PLACEMENT_PROVIDED",
            "display_status": "Placement Provided",
            "value": 2
          },
          {
            "status": "READY_FOR_UNLOADING",
            "display_status": "Ready For Unloading",
            "value": 3
          },
          {
            "status": "UNLOADING_START",
            "display_status": "Unloading Start",
            "value": 4
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
      }
    ]
  }
  
  export const dashboardDataApi = async (body) => {
    try {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const data = {
                        data: dashData,
                        message: '',
                        status: 'OK'
                    }
                    resolve(data);
                } catch (error) {
                    reject(new Error("ERR_CONNECTION_REFUSED"));
                }
            }, DELAY);
        });
    } catch (error) {
      console.error("dashboard error:", error.response);
      processError(error, 'Error getting dashboard data')
    }
  };
  