import React, { useState, useContext } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  Stack,
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import FilterListIcon from "@mui/icons-material/FilterList";
import TableSortLabel from "@mui/material/TableSortLabel";
import { AppTheme } from "../../utils/theme";
import { AppContext } from "../../context/app-context";

const FILTER_COLUMNS = ["store_no", "status"]; /////////////////////////Also filter on basis of dates!!!!
//FILTER_COLUMNS: Holds an array of column names that are filterable in the table.

//HEADINGS: Contains key-value pairs of column names to their display names, used for column headers in the table.
const HEADINGS = {
  store_no: "Store No",
  reg_no: "Reg No",
  status: "Status",
  store_business_date: "Store Business Date",
  store_trans_no: "Current Store Trans No",
  xcenter_business_date: "Xcenter Sync Business Date",
  xcenter_trans_no: "Xcenter Trans No",
  runtime: "Runtime",
};

export default function FilteredTable({ filteredData }) {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(null);
  const [filterHeaderData, setFilterHeaderData] = useState({});

  //useState:
  //order and setOrder: Manage the sorting order of the table.
  //orderBy and setOrderBy: Track the currently ordered column in the table.
  //filterHeaderData and setFilterHeaderData: Store and manage the filter values for each header column.

  // Debugging statement to check received data
  console.log("Filtered Data:", filteredData);

  if (
    !filteredData ||
    !Array.isArray(filteredData) ||
    filteredData.length === 0
  ) {
    return <div>No data available</div>;
  }

  //handleRequestSort: Controls the sorting functionality based on the column being clicked and updates the order and orderBy states accordingly.
  const handleRequestSort = (property) => {
    let newOrder = "desc";
    if (orderBy === property && order === "desc") {
      newOrder = "asc";
    }
    setOrder(newOrder);
    setOrderBy(property);
  };

  //sortedRows: Calls stableSort with getComparator to sort the rows based on the sorting order and column.
  const sortedRows = (rows) => {
    return stableSort(rows, getComparator(order, orderBy));
  };

  // handleFilterHeaderDataChange: Updates the filter header data object when a filter value changes for a specific column.
  const handleFilterHeaderDataChange = (column, value) => {
    setFilterHeaderData((prevData) => {
      return { ...prevData, [column]: value };
    });
  };

  const clearFilterHeaderData = (column) => {
    setFilterHeaderData((prevData) => {
      return { ...prevData, [column]: "" };
    });
  };
  //to clear the filter applied to a specific column in the table

  return (
    //Renders a stack that centers the content, a Paper component for styling, and a TableContainer with a Table component to display the data
    <Stack sx={{ width: "100%", alignItems: "center" }}>
      <Paper square sx={{ width: "100%" }}>
        <TableContainer>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {/*Mapping Over HEADINGS: Loops over the defined column headings to render filtering and sorting components for each column.*/}
                {Object.keys(HEADINGS).map((column) => (
                  <TableCell
                    key={column}
                    style={{
                      fontSize: "15px",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {FILTER_COLUMNS.includes(column) && (
                      <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                        <TextField
                          size="small"
                          variant="standard"
                          label={`${HEADINGS[column]}`}
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
                                  onClick={() => clearFilterHeaderData(column)}
                                >
                                  <ClearIcon fontSize="small" />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          value={filterHeaderData[column] || ""}
                          onChange={(e) =>
                            handleFilterHeaderDataChange(column, e.target.value)
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
                ))}
              </TableRow>
            </TableHead>

            <TableHead>
              <TableRow>
                {Object.keys(HEADINGS).map((column) => (
                  <TableCell
                    key={column}
                    style={{
                      backgroundColor: AppTheme.tableHeaderColor,
                      fontSize: "15px",
                      fontWeight: "bold",
                      height: 0,
                      textAlign: "center",
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === column}
                      direction={orderBy === column ? order : "asc"}
                      onClick={() => handleRequestSort(column)}
                    >
                      {HEADINGS[column]}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {/*Iterating Over Rows: Maps over the sorted and filtered rows to display row data in the table cells based on the defined column headings. */}
              {sortedRows(filteredData).map((row, rowIndex) => (
                <TableRow hover key={`row-${rowIndex}`}>
                  {Object.keys(HEADINGS).map((column, columnIndex) => (
                    <TableCell
                      key={`cell-${columnIndex}`}
                      sx={{ fontSize: "15px" }}
                      style={
                        column === "status"
                          ? {
                              color:
                                statusAttributes[row[column]]?.color ||
                                "inherit",
                            }
                          : {}
                      }
                    >
                      {column === "status"
                        ? statusAttributes[row[column]]?.description ||
                          row[column]
                        : row[column]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Stack>
  );
}
