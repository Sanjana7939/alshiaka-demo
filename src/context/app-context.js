// AppContext.js
import React, {
  createContext, useEffect, useMemo, useState,
} from 'react';
import dayjs from 'dayjs';
import { AppConstants } from '../config/app-config';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [isApplicationLoading, setIsApplicationLoading] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [user, setUser] = useState();
  const [userRoleId, setUserRoleId] = useState('');
  const [rolesLoading, setRolesLoading] = useState(true);

  // dashboard data
  const [category, setCategory] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [startDate, setStartDate] = useState(dayjs().tz(AppConstants.TIMEZONE).subtract(30, 'day'));
  const [endDate, setEndDate] = useState(dayjs().tz(AppConstants.TIMEZONE));
  const [dashboardData, setDashboardData] = useState()
  const [dashboardLoading, setDashboardLoading] = useState(true)

  const clearAppContext = () => {
    setIsApplicationLoading(false);
    setIsSidebarExpanded(false);
    setUser(null);
    setUserRoleId('');
    setRolesLoading(true);

    setCategory("ALL");
    setStatus("ALL"); 
    setDashboardLoading(true);
    setDashboardData();
  };

  const contextValue = useMemo(
    () => ({
      user, setUser,
      userRoleId, setUserRoleId,
      isApplicationLoading,
      setIsApplicationLoading,
      isSidebarExpanded,
      setIsSidebarExpanded,
      clearAppContext,
      rolesLoading, setRolesLoading,

      status, setStatus,
      category, setCategory,
      startDate, setStartDate,
      endDate, setEndDate,
      dashboardData, setDashboardData,
      setDashboardLoading, dashboardLoading,
    }),
    [isApplicationLoading, isSidebarExpanded, 
      user, userRoleId,
      rolesLoading, setRolesLoading,

      status, category, startDate, endDate, dashboardLoading, dashboardData,
    ],
  );

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
