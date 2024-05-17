import React, { createContext, useEffect, useMemo, useState } from 'react';

const ShipmentManagementContext = createContext();

const ShipmentManagementProvider = ({ children }) => {
  const [isContainersLoading, setIsContainersLoading] = useState(true);
  const [containersList, setContainersList] = useState([]);
  const [displayName, setDisplayName] = useState([]);
  const [displayAttribute, setDisplayAttribute] = useState([]);
  const [facilityList, setFacilityList] = useState([]);
  const [dockList, setDockList] = useState([]);
  const [dcList, setDcList] = useState([]);
  const [warehouseList, setWarehouseList] = useState([]);
  const [transporterList, setTransporterList] = useState([]);
  const [fileUploadLoading, setFileUploadLoading] = useState(true);
  const [paginationToken, setPaginationToken] = useState(null);
  const [requestLoading, setRequestLoading] = useState(false);
  const [statusAttributes, setStatusAttributes] = useState({});

  const clearShipmentManagementData = () => {
    setIsContainersLoading(true);
    setContainersList([]);
    setDisplayName([]);
    setDisplayAttribute([]);
    setFileUploadLoading(true);
    setPaginationToken(null);
    setRequestLoading(false);
    setStatusAttributes({});
  };

  const clearShipmentManagementContext = () => {
    setIsContainersLoading(true);
    setContainersList([]);
    setDisplayName([]);
    setDisplayAttribute([]);
    setFacilityList([]);
    setDockList([]);
    setDcList([]);
    setWarehouseList([]);
    setTransporterList([]);
    setFileUploadLoading(true);
    setPaginationToken(null);
    setRequestLoading(false);
    setStatusAttributes({});
  };

  const contextValue = useMemo(() => ({
    clearShipmentManagementContext,
    clearShipmentManagementData,
    isContainersLoading, setIsContainersLoading,
    containersList, setContainersList,
    displayName, setDisplayName,
    displayAttribute, setDisplayAttribute,
    facilityList, setFacilityList,
    dockList, setDockList,
    dcList, setDcList,
    warehouseList, setWarehouseList,
    transporterList, setTransporterList,
    fileUploadLoading, setFileUploadLoading,
    paginationToken, setPaginationToken,
    requestLoading, setRequestLoading,
    statusAttributes, setStatusAttributes,
  }),
    [isContainersLoading, containersList, 
      displayName, displayAttribute, 
      facilityList, dockList, dcList, warehouseList, transporterList, 
      fileUploadLoading, paginationToken, 
      requestLoading, statusAttributes]);

  return (
    <ShipmentManagementContext.Provider value={contextValue}>
      {children}
    </ShipmentManagementContext.Provider>
  );
};

export { ShipmentManagementContext, ShipmentManagementProvider };
