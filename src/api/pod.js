import { endpoints } from "../config/app-config";
import axios from "axios";
import { createAuthenticationHeaderForApi } from "./groupHandlers";
import { processError } from "./utils";

export const lovEntityType = async (entityType) => {
    try {
        const headers = await createAuthenticationHeaderForApi();
        const response = await axios.get(`${ endpoints.lov }/?entityType=${ entityType }`, headers);
        if (response.data) {
            console.log('lovEntityType api:', response.data)
            return response.data;
        }
        throw new Error("ERR_CONNECTION_REFUSED");
    } catch (error) {
        console.error("lovEntityType error:", error.response);
        processError(error, 'Error fetching lov EntityType')
    }
};

export const crudLov = async (data) => {
    try {
        const headers = await createAuthenticationHeaderForApi();
        const response = await axios.post(`${ endpoints.crudLov }`, data, headers);
        if (response.data) {
            console.log('crudLov api:', response.data)
            return response.data;
        }
        throw new Error("ERR_CONNECTION_REFUSED");
    } catch (error) {
        console.error("crudLov error:", error.message);
        processError(error, 'Error in crudLov API')
    }
};