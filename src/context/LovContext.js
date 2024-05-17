import React, { createContext, useMemo, useState } from 'react';
  
  const LovContext = createContext();
  
  const LovProvider = ({ children }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [lovLoading, setLovLoading] = useState(true);
    const [lovList, setLovList] = useState([]);
    const [requestLoading, setRequestLoading] = useState(false);
    const [lovSearchText, setLovSearchText] = useState('');
  
    const clearLovContext = () => {
        setPage(0);
        setRowsPerPage(10);
        setLovLoading(true);
        setLovList([]);
        setRequestLoading(false);
        setLovSearchText('');
    };
  
    const contextValue = useMemo(
      () => ({
        page, setPage,
        rowsPerPage, setRowsPerPage,
        lovLoading, setLovLoading,
        lovList, setLovList,
        requestLoading, setRequestLoading,
        lovSearchText, setLovSearchText,
        clearLovContext,
      }),
      [ page, setPage,
        rowsPerPage, setRowsPerPage,
        lovLoading, setLovLoading, 
        lovList, setLovList,
        requestLoading, setRequestLoading,
        lovSearchText, setLovSearchText,
        clearLovContext,
      ],
    );
  
    return (
      <LovContext.Provider value={contextValue}>
        {children}
      </LovContext.Provider>
    );
  };
  
  export { LovContext, LovProvider };
  