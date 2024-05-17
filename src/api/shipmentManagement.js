import { endpoints } from "../config/app-config";
import axios from "axios";
import { createAuthenticationHeaderForApi } from "./groupHandlers";
import { processError } from "./utils";

export const listShipments = async (screen, lastEvaluatedKey) => {
    try {
        const headers = await createAuthenticationHeaderForApi();
        console.log('headers=', headers)
        const limit = '50';
        let endpoint = `${ endpoints.listShipments }/?screen=${ screen }&limit=${ limit }`;
        if (lastEvaluatedKey) {
            endpoint = `${ endpoints.listShipments }/?screen=${ screen }&limit=${ limit }&lastEvaluatedKey=${ lastEvaluatedKey }`
        }
        const response = await axios.get(endpoint, headers);
        if (response.data) {
            console.log('listShipments api:', response.data)
            return response.data;
        }
        throw new Error("ERR_CONNECTION_REFUSED");
    } catch (error) {
        console.error("listShipments error:", error.response);
        processError(error, 'Error fetching shipments')
    }
};

export const updateContainer = async (data) => {
    try {
        const headers = await createAuthenticationHeaderForApi();
        const response = await axios.put(`${ endpoints.updateContainerDetails }`, data, headers);
        if (response.data) {
            console.log('updateContainer api:', response.data)
            return response.data;
        }
        throw new Error("ERR_CONNECTION_REFUSED");
    } catch (error) {
        console.error("updateContainer error:", error.response);
        processError(error, 'Error updating container')
    }
};

export const fileUpload = async (data, force) => {
    // const result = await mockAPI({ data: 'Mock data' }, 5000);
    try {
        const headers = await createAuthenticationHeaderForApi();
        const endpoint = `${ endpoints.fileUpload }?force=${force}`;
        const response = await axios.post(`${ endpoint }`, data, headers);
        if (response.data) {
            console.log('fileUpload api:', response.data)
            return response.data;
        }
        throw new Error("ERR_CONNECTION_REFUSED");
    } catch (error) {
        console.log("fileUpload error:", error.message);
        processError(error, 'Error uploading file data')
    }
};

export const fileUploadLov = async (type) => {
    try {
        const headers = await createAuthenticationHeaderForApi();
        const endpoint = `${ endpoints.fileUploadLov }/?valueType=${ type }`;
        const response = await axios.get(`${ endpoint }`, headers);
        if (response.data) {
            console.log('fileUploadLov api:', response.data)
            return response.data;
        }
        throw new Error("ERR_CONNECTION_REFUSED");
    } catch (error) {
        console.log("fileUploadLov error:", error.message);
        processError(error, 'Error uploading file data')
    }
};
