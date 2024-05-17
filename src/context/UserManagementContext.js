import React, {
    createContext, useMemo, useState,
  } from 'react';
  
  const UserManagementContext = createContext();
  
  const UserManagementProvider = ({ children }) => {
    const [userList, setUsersList] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [requestLoading, setRequestLoading] = useState(false);
    const [paginationToken, setPaginationToken] = useState(null);
    const [page, setPage] = useState(0);
    const [maxPageNo, setMaxPageNo] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
  
    const clearUserManagementContext = () => {
      setUsersLoading(true);
      setUsersList([]);
      setRequestLoading(false);
      setPaginationToken(null);
      setRowsPerPage(25);
      setPage(0);
      setMaxPageNo(0);
    };
  
    const contextValue = useMemo(
      () => ({
        usersLoading, setUsersLoading,
        userList, setUsersList,
        requestLoading, setRequestLoading,
        paginationToken, setPaginationToken,
        page, setPage,
        rowsPerPage, setRowsPerPage,
        maxPageNo, setMaxPageNo,
        clearUserManagementContext,
      }),
      [ usersLoading, setUsersLoading, 
        userList, setUsersList,
        requestLoading, setRequestLoading,
        paginationToken, setPaginationToken,
        page, setPage,
        rowsPerPage, setRowsPerPage,
        maxPageNo, setMaxPageNo,
        clearUserManagementContext,
      ],
    );
  
    return (
      <UserManagementContext.Provider value={contextValue}>
        {children}
      </UserManagementContext.Provider>
    );
  };
  
  export { UserManagementContext, UserManagementProvider };
  