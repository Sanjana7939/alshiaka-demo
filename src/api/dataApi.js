import axios from "axios";
import { processError } from "./utils";

const DELAY = 500;

const display_attribute = [
    'store_no',
    'reg_no',
    'status',
    'store_business_date',
    'current_store_trans_no',
    'x_center_sync_business_date',
    'x_center_trans_no',
    'runtime',
]
const display_name = {
    'store_no': 'store no',
    'reg_no': 'reg no',
    'status': 'status',
    'store_business_date': 'store business date',
    'current_store_trans_no': 'current store trans no',
    'x_center_sync_business_date': 'x center sync_business_date',
    'x_center_trans_no': 'x center trans_no',
    'runtime': 'runtime',
}

const status_attributes = {
    'N': {
        'description': 'Data Not Synced',
        'color': 'red'
    },
    'Y': {
        'description': 'Data Synced',
        'color': 'green'
    }
}

const transfers = [
    {
        store_no: '1001',
        reg_no: '1',
        status: 'N',
        store_business_date: '1/6/24',
        current_store_trans_no: '1',
        x_center_sync_business_date: '1/6/24',
        x_center_trans_no: '1',
        runtime: 'abcd',
    },
    {
        store_no: '1002',
        reg_no: '1',
        status: 'Y',
        store_business_date: '1/6/24',
        current_store_trans_no: '1',
        x_center_sync_business_date: '1/6/24',
        x_center_trans_no: '1',
        runtime: 'abcd',
    },
    {
        store_no: '1003',
        reg_no: '1',
        status: 'N',
        store_business_date: '1/6/24',
        current_store_trans_no: '1',
        x_center_sync_business_date: '1/6/24',
        x_center_trans_no: '1',
        runtime: 'abcd',
    },
    {
        store_no: '1004',
        reg_no: '1',
        status: 'Y',
        store_business_date: '1/6/24',
        current_store_trans_no: '1',
        x_center_sync_business_date: '1/6/24',
        x_center_trans_no: '1',
        runtime: 'abcd',
    },
]

export const listData = async () => {
    try {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const data = {
                        display_attribute,
                        display_name,
                        status_attributes,
                        transfers,
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
        console.error("listData error:", error.response);
        processError(error, 'Error fetching data')
    }
};
