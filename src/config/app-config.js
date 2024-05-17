import { toast } from 'react-toastify';

export const colors = {
  primary: '#356ffb',
  secondary: '#D14C3C',
  tertiary: '#CCCCCC',
  lightBlue: '#f2f2ff',
  oddRow: '#f2f2ff',
  evenRow: '#f9fafb'
};

export const AppConstants = {
  ADD: 'ADD',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  DEBUG: 'DEBUG',
  REJETCED: 'REJECTED',
  FULFILLED: 'FULFILLED',
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
  AUTHENTICATED: 'authenticated',
  BRAND: 'brand',
  CATEGORY: 'category',
  TIMEZONE: 'Asia/Dubai',
};

export const notify = (type, message) => {
  toast.dismiss();
  toast(message, { type, delay: 0 });
};

export const idpBaseUrl = process.env.REACT_APP_BACKEND_IDP_BASE_URL;
export const podBaseUrl = process.env.REACT_APP_BACKEND_POD_BASE_URL;

export const endpoints = {
  dashboard: idpBaseUrl + '/dashboard',
  updateRole: idpBaseUrl + '/usermanagement/role',
  addUser: idpBaseUrl + '/usermanagement/user',
  allRoles: idpBaseUrl + '/usermanagement/role',
  allUsers: idpBaseUrl + '/usermanagement/user',

  lov: podBaseUrl + '/lov',
  crudLov: idpBaseUrl + '/lov',
  listShipments: idpBaseUrl + '/listShipments',
  fileUpload: idpBaseUrl + '/fileUpload',
  updateContainerDetails: idpBaseUrl + '/updateContainerDetails',
  getDetailsByContainerId: idpBaseUrl + '/getDetailsByContainerId',
  getContainerHistory: idpBaseUrl + '/getContainerHistory',
  fileUploadLov: idpBaseUrl + '/fileUpload/lov',
};