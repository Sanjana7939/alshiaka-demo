import { AppConstants, endpoints } from "../config/app-config";
import axios from "axios";
import { notify } from "../config/app-config";
import { createAuthenticationHeaderForApi } from "./groupHandlers";

export const updateRole = async (params) => {
  console.log("params sent to api", params);
  try {
    const headers = await createAuthenticationHeaderForApi();
    const response = await axios.put(`${endpoints.updateRole}`, params, headers);
    console.log("API response:", response);
    if (response) {
      return response;
    } else {
      throw "ERR_CONNECTION_REFUSED";
    }
  } catch (error) {
    console.error("Can't fetch details", error);
    if (error.response && error.response.data && error.response.data.message) {
      const errorMessage = error.response.data.message;
      notify(AppConstants.ERROR, errorMessage);
    } else {
      notify(AppConstants.ERROR, "Can't Update Role");
    }
  }
};



export const addUser = async (userData) => {
  console.log("params sent to api", userData);
  try {
    const headers = await createAuthenticationHeaderForApi();
    const response = await axios.post(`${endpoints.addUser}`, userData, headers);
    console.log("API response:", response);
    if (response) {
      return response;
    } else {
      throw "ERR_CONNECTION_REFUSED";
    }
  } catch (error) {
    console.error("Can't fetch details", error);
    if (error.response && error.response.data && error.response.data.message) {
      const errorMessage = error.response.data.message;
      notify(AppConstants.ERROR, errorMessage);
    } else {
      notify(AppConstants.ERROR, "Can't add user");
    }
  }
};



export const allRoles = async () => {
  try {
    const headers = await createAuthenticationHeaderForApi();
    const response = await axios.get(`${endpoints.allRoles}`, headers);
    if (response.data) {
      return response.data;
    } else {
      throw "ERR_CONNECTION_REFUSED";
    }
  } catch (error) {
    console.error("Can't fetch details", error);
    notify(AppConstants.ERROR, "Can't fetch details");
  }
};


export const getRoleByRoleId = async ({ roleIds }) => {
  try {
    const headers = await createAuthenticationHeaderForApi();
    const response = await axios.get(`${endpoints.allRoles}?roleIds=${roleIds}`, headers);
    if (response.data) {
      return response.data;
    } else {
      throw "ERR_CONNECTION_REFUSED";
    }
  } catch (error) {
    console.error("Can't fetch details", error);
    notify(AppConstants.ERROR, "Can't fetch details");
  }
};

export const allUsers = async (limit, paginationToken) => {
  try {
    const headers = await createAuthenticationHeaderForApi();
    console.log(headers)
    let endpoint = `${endpoints.allUsers}?limit=${limit}`;
    if (paginationToken) {
      endpoint = `${endpoints.allUsers}?limit=${limit}&paginationToken=${paginationToken}`;
    }
    const response = await axios.get(endpoint, headers);
    if (response.data) {
      return response.data;
    } else {
      throw "ERR_CONNECTION_REFUSED";
    }
  } catch (error) {
    console.error("Can't fetch details", error);
    notify(AppConstants.ERROR, "Can't fetch details");
  }
};

export const getUserById = async ({ userIds }) => {
  try {
    const headers = await createAuthenticationHeaderForApi();
    const response = await axios.get(`${endpoints.allUsers}?userIds=${userIds}`, headers);
    if (response.data) {
      return response.data;
    } else {
      throw "ERR_CONNECTION_REFUSED";
    }
  } catch (error) {
    console.error('getUserById', error);
    throw new Error(`getUserById: ${ error.message }`)
  }
};


export const addRole = async (userData) => {
  console.log("params sent to api", userData);
  try {
    const headers = await createAuthenticationHeaderForApi();
    const response = await axios.post(`${endpoints.allRoles}`, userData, headers);
    console.log("API response:", response);
    if (response) {
      return response;
    } else {
      throw "ERR_CONNECTION_REFUSED";
    }
  } catch (error) {
    console.error("Can't fetch details", error);
    if (error.response && error.response.data && error.response.data.message) {
      const errorMessage = error.response.data.message;
      notify(AppConstants.ERROR, errorMessage);
    } else {
      notify(AppConstants.ERROR, "Can't add role");
    }
  }
};


export const updateUser = async (userData) => {
  console.log("params sent to api", userData);
  try {
    const headers = await createAuthenticationHeaderForApi();
    const response = await axios.put(`${endpoints.addUser}`, userData, headers);
    console.log("API response:", response);
    if (response) {
      return response;
    } else {
      throw "ERR_CONNECTION_REFUSED";
    }
  } catch (error) {
    console.error("Can't fetch details", error);
    if (error.response && error.response.data && error.response.data.message) {
      const errorMessage = error.response.data.message;
      notify(AppConstants.ERROR, errorMessage);
    } else {
      notify(AppConstants.ERROR, "Can't update user");
    }
  }
};



export const deleteRole = async (roleId) => {
  try {
    const headers = await createAuthenticationHeaderForApi();
    console.log("headersheadersheaders:", headers);
    const response = await axios.delete(`${endpoints.updateRole}?roleId=${roleId}`, headers);
    console.log("API response:", response);
    if (response) {
      return response;
    } else {
      throw "ERR_CONNECTION_REFUSED";
    }
  } catch (error) {
    console.error("Can't fetch details", error);
    if (error.response && error.response.data && error.response.data.message) {
      const errorMessage = error.response.data.message;
      notify(AppConstants.ERROR, errorMessage);
    } else {
      notify(AppConstants.ERROR, "Can't Update Role");
    }
  }
};