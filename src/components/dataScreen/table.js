import * as React from "react";
import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  notify,
  stableSort,
  getComparator,
  ScrollbarDesign,
} from "../../utils/index";
import { useContext } from "react";
import { AppConstants } from "../../config/app-config";
import {
  Stack,
  Tooltip,
  TextField,
  Button,
  Box,
  InputAdornment,
} from "@mui/material";
import TableSortLabel from "@mui/material/TableSortLabel";
import IconButton from "@mui/material/IconButton";
import useBreakpoints from "../../components/useBreakPoints";
import { ShipmentManagementContext } from "../../context/ShipmentManagementContext";
import { BootstrapTooltip } from "../styledToolTips/BootstrapTooltip";
import TableRowsIcon from "@mui/icons-material/TableRows";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import {
  isLongString,
  renderTableCell,
  getColumnStyles,
  getFilteredData,
} from "../../utils/shipmentManagement";
import { AppTheme } from "../../utils/theme";
import ActionButtonsGroup from "../shipmentComponents/ActionButtonsGroup";
import { listData } from "../../api/dataApi";

const FILTER_COLUMNS = ["store_no", "status"];
//FILTER_COLUMNS: Defines the columns that are filterable.

export default function DataScreenTable() {
  const [page, setPage] = useState(0); //Current pagination page, initially set to 0.
  const [rowsPerPage, setRowsPerPage] = useState(25); //Number of rows to be displayed per page, initially set to 25.
  const [order, setOrder] = useState("asc"); //order: Sort order of the table, initialized to "asc".
  const [orderBy, setOrderBy] = useState(null); //orderBy: Column name by which the table is sorted.
  const [selectedRow, setSelectedRow] = useState(null); //Currently selected row (initially null)
  const [filteredData, setFilteredData] = useState([]); //Data to be displayed in the table after applying filters
  const [filterHeaderData, setFilterHeaderData] = useState({}); //Stores the filter criteria for each column.
  const [isTableDense, setIsTableDense] = useState(true); //Boolean flag to determine if the table is dense (compact).

  //The useBreakpoints hook is used to get the current breakpoint sizes (isXs, isSm, isMd, isLg, isXl),
  //which help determine the responsive font and width sizes.
  const { isXs, isSm, isMd, isLg, isXl } = useBreakpoints();
  //responsiveFontSize and responsiveWidthSize are calculated based on the current breakpoint.
  const responsiveFontSize = isXs
    ? "9px"
    : isSm
    ? "10px"
    : isMd
    ? "11px"
    : isLg
    ? "13px"
    : isXl
    ? "15px"
    : "18px";
  const responsiveWidthSize = isXs
    ? "45px"
    : isSm
    ? "55px"
    : isMd
    ? "55px"
    : isLg
    ? "80px"
    : isXl
    ? "150px"
    : "250px";

  //Destructures various state and functions from the ShipmentManagementContext
  const {
    clearShipmentManagementContext, //Methods to clear context data
    clearShipmentManagementData, //Methods to clear context data
    isContainersLoading, //State for loading status of containers
    setIsContainersLoading, //Setter for loading status of containers
    containersList, //State and setter for the list of containers.
    setContainersList,
    displayName, //State and setter for display names.
    setDisplayName,
    displayAttribute, //State and setter for display attributes.
    setDisplayAttribute,
    facilityList,
    setFacilityList,
    dockList,
    setDockList,
    dcList,
    setDcList,
    transporterList,
    //These pairs manage lists of facilities, docks, distribution centers, and transporters respectively.
    setTransporterList,
    paginationToken, //State and setter for pagination token used for loading more data
    setPaginationToken,
    requestLoading, //State and setter for request loading status
    setRequestLoading,
    statusAttributes, //State and setter for status attributes, which are used to display the status of items in the table.
    setStatusAttributes,
  } = useContext(ShipmentManagementContext);

  //Asynchronous IIFE (Immediately Invoked Function Expression) that runs when isContainersLoading or requestLoading changes.
  useEffect(() => {
    (async () => {
      try {
        if (isContainersLoading) {
          //Fetches data if isContainersLoading is true
          const searchParams = new URLSearchParams(window.location.search);
          const status = searchParams.get("status");
          const response = await listData(status); //Calls listData(status) to fetch data

          //Updates context with the fetched data: setContainersList, setDisplayName, setDisplayAttribute, setStatusAttributes, and setPaginationToken.
          if (response) {
            setContainersList(response.transfers);
            setDisplayName(response.display_name);
            setDisplayAttribute(response.display_attribute);
            setStatusAttributes(response.status_attributes);

            if (response.paginationToken) {
              setPaginationToken(response.paginationToken);
            } else {
              setPaginationToken(null);
            }
          }
        }
      } catch (e) {
        //Handles errors with notify, which likely displays an error message.
        notify(AppConstants.ERROR, e);
      } finally {
        //updates loading states setIsContainersLoading and setRequestLoading to false
        if (isContainersLoading) {
          setIsContainersLoading(false);
        }
        if (requestLoading) {
          setRequestLoading(false);
        }
      }
    })();
  }, [isContainersLoading, requestLoading]);
  useEffect(() => {
    return () => {
      clearShipmentManagementData();
      //Calls clearShipmentManagementData to clear context data when the component unmounts.
    };
  }, []);
  //When the containersList changes, the useEffect hook updates the filteredData state to either the containersList (if it has data) or an empty array.
  useEffect(() => {
    if (containersList.length > 0) {
      setFilteredData(containersList);
    } else {
      setFilteredData([]);
    }
  }, [containersList]);

  //handleRequestSort function is used to update the order and orderBy state when the user clicks on a column header to sort the table.
  const handleRequestSort = (property) => {
    let newOrder = "desc";
    if (orderBy === property && order === "desc") {
      newOrder = "asc";
    }
    setOrder(newOrder);
    setOrderBy(property);
  };
  //handleRequestSort function is used to update the order and orderBy state when the user clicks on a column header to sort the table.
  const sortedRows = (rows) => {
    return stableSort(rows, getComparator(order, orderBy));
  };

  //helper function that searches the transporterList for a transporter with the given entityID and returns it. If not found, it returns null.
  const getTransporter = (value) => {
    for (const t of transporterList) {
      if (t.entityID === value) {
        return t;
      }
    }
    return null;
  };

  //commented out currently. loadMoreData function is responsible for fetching and loading more data when the user clicks the "Load more" button.
  const loadMoreData = async () => {
    try {
      // setRequestLoading(true);
      // const response = await listShipments(SHIPMENT_TYPE, paginationToken);
      // setContainersList((prev) => {
      //     let data = [...prev];
      //     return data.concat(response.data.transfers);
      // });
      // if (response.data.paginationToken) {
      //     setPaginationToken(response.data.paginationToken)
      // } else {
      //     setPaginationToken(null)
      // }
    } catch (e) {
      notify(AppConstants.ERROR, e);
    } finally {
      // setFilterHeaderData({});
      setRequestLoading(false);
    }
  };

  //handleFilterHeaderDataChange function is used to update the filterHeaderData state when the user types in the filter input fields.
  const handleFilterHeaderDataChange = (column, value) => {
    setFilterHeaderData((prevData) => {
      return { ...prevData, [column]: value };
    });
  };

  //Clears the filter value for a specific column by setting it to an empty string.
  const clearFilterHeaderData = (column) => {
    setFilterHeaderData((prevData) => {
      return { ...prevData, [column]: "" };
    });
  };

  useEffect(() => {
    if (!filteredData) {
      return;
    }
    setFilteredData(
      getFilteredData(containersList, filterHeaderData, statusAttributes) // to get the data that matches the filter criteria and updates the filteredData state.
    );
  }, [filterHeaderData, containersList]); //Whenever filterHeaderData or containersList changes, this effect is triggered

  return (
    // <Stack sx={{ width: "100%", alignItems: "center", overflowY: 'auto', ...ScrollbarDesign }} >
    <Stack sx={{ width: "100%", alignItems: "center", ...ScrollbarDesign }}>
      <ActionButtonsGroup //Renders ActionButtonsGroup, passing isTableDense and setIsTableDense to manage whether the table is dense.
        isTableDense={isTableDense}
        setIsTableDense={setIsTableDense}
      />

      {/* sx={{ width: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }} */}
      <Paper square sx={{ width: "100%" }}>
        <TableContainer sx={{ ...ScrollbarDesign }}>
          <Table stickyHeader size={isTableDense ? "small" : ""}>
            <TableHead>
              <TableRow>
                {displayAttribute.map((column) => {
                  return (
                    <TableCell
                      key={column}
                      style={{
                        fontSize: responsiveFontSize,
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {/* If a column is in FILTER_COLUMNS, it renders a TextField for filtering and includes an IconButton to clear the filter and another IconButton with a FilterListIcon. */}
                      {FILTER_COLUMNS.includes(column) && (
                        <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                          <TextField
                            size="small"
                            variant="standard"
                            label={`${displayName[column]}`}
                            sx={{
                              maxWidth: "15ch",
                              color: "action.active",
                              mr: 0.5,
                              my: 0.5,
                            }}
                            InputLabelProps={{
                              style: { fontSize: "0.8rem" },
                            }}
                            InputProps={{
                              endAdornment: filterHeaderData[column] && (
                                <InputAdornment position="end">
                                  <IconButton
                                    edge="end"
                                    onClick={() =>
                                      clearFilterHeaderData(column)
                                    }
                                  >
                                    <ClearIcon fontSize="small" />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                            value={filterHeaderData[column] || ""}
                            onChange={(e) =>
                              handleFilterHeaderDataChange(
                                column,
                                e.target.value
                              )
                            }
                          />
                          <Tooltip title="Filter" size="small">
                            <IconButton>
                              <FilterListIcon
                                fontSize="small"
                                sx={{ color: "action.active" }}
                              />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>

            <TableHead>
              <TableRow>
                {displayAttribute.map((column) => (
                  <TableCell
                    key={column}
                    style={{
                      // backgroundColor: '#4870D6',
                      backgroundColor: AppTheme.tableHeaderColor,
                      fontSize: responsiveFontSize,
                      fontWeight: "bold",
                      height: 0,
                      // color: 'white !important',
                      textAlign: "center",
                    }}
                  >
                    <TableSortLabel //Wraps the column header text with a TableSortLabel to make it sortable
                      active={true} //active prop determines if the column is currently the one being sorted.
                      direction={orderBy === column ? order : "asc"} //sets the sorting direction.
                      onClick={() => handleRequestSort(column)} // triggers sorting for the column using handleRequestSort
                      // style={{ color: 'white' }}
                      // sx={{ '& svg': { color: 'white !important' } }}
                    >
                      {displayName[column]}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedRows(filteredData) //Iterates over the sorted and filtered data to generate table rows
                // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, rowIndex) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={`row-${rowIndex}`}
                  >
                    {displayAttribute.map((column, columnIndex) => {
                      if (column === "status") {
                        return (
                          <TableCell
                            key={`cell-${columnIndex}`}
                            sx={{ height: "0px", fontSize: responsiveFontSize }}
                            style={{
                              ...getColumnStyles(column),
                            }}
                          >
                            <span
                              style={{
                                background: statusAttributes[row[column]].color,
                                color: "white",
                                borderRadius: "3px",
                                padding: "2px",
                              }}
                            >
                              {renderTableCell(
                                column,
                                statusAttributes[row[column]].description
                              )}
                            </span>
                          </TableCell>
                        );
                      }

                      return (
                        <TableCell
                          key={`cell-${columnIndex}`}
                          sx={{ height: "0px", fontSize: responsiveFontSize }}
                          style={{
                            ...getColumnStyles(column),
                          }}
                        >
                          {isLongString(row[column]) ? (
                            <BootstrapTooltip arrow title={row[column]}>
                              {renderTableCell(column, row[column])}
                            </BootstrapTooltip>
                          ) : (
                            renderTableCell(column, row[column])
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* <TablePagination
                    rowsPerPageOptions={[25, 50, 100]}
                    component="div"
                    count={filteredData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    // stickyHeader={false}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                /> */}
      </Paper>

      <div style={{ width: "100%", padding: "10px" }}>
        {/* <span style={{ margin: '5px' }}>Total rows: {filteredData ? filteredData.length : 0}</span> */}
        <Button
          variant="text"
          startIcon={<TableRowsIcon />}
          size="small"
          sx={{ marginRight: 1, color: "grey" }}
        >
          Total rows: {filteredData ? filteredData.length : 0}
        </Button>
        {paginationToken && (
          <Button //button is disabled when requestLoading is true.
            variant="outlined"
            startIcon={<BrowserUpdatedIcon />}
            sx={{ marginRight: 1 }}
            onClick={loadMoreData} //button's onClick triggers loadMoreData
            size="small"
          >
            Load more
          </Button>
        )}
      </div>
    </Stack>
  );
}
