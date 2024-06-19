import * as React from "react";
import { useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { ScrollbarDesign } from "../../utils/index";
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
import { listData } from "../../api/dataApi";
import { useContext, useState } from "react";
import { AppContext } from "../../context/app-context";

const FILTER_COLUMNS = ["store_no", "status"];

export default function FilteredTable({ filteredData }) {
  const { statusAttributes, displayAttribute, displayName } =
    useContext(AppContext);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState(null);
  const [filterHeaderData, setFilterHeaderData] = useState({});

  useEffect(() => {}, [filteredData]);

  const handleRequestSort = (property) => {
    let newOrder = "desc";
    if (orderBy === property && order === "desc") {
      newOrder = "asc";
    }
    setOrder(newOrder);
    setOrderBy(property);
  };

  const sortedRows = (rows) => {
    return stableSort(rows, getComparator(order, orderBy));
  };

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

  if (!filteredData || filteredData.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <Stack sx={{ width: "100%", alignItems: "center", ...ScrollbarDesign }}>
      <Paper square sx={{ width: "100%" }}>
        <TableContainer sx={{ ...ScrollbarDesign }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {displayAttribute.map((column) => {
                  return (
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
                      backgroundColor: AppTheme.tableHeaderColor,
                      fontSize: "15px",
                      fontWeight: "bold",
                      height: 0,
                      textAlign: "center",
                    }}
                  >
                    <TableSortLabel
                      active={true}
                      direction={orderBy === column ? order : "asc"}
                      onClick={() => handleRequestSort(column)}
                    >
                      {displayName[column]}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedRows(filteredData).map((row, rowIndex) => (
                <TableRow hover key={`row-${rowIndex}`}>
                  {displayAttribute.map((column, columnIndex) => {
                    if (column === "status") {
                      return (
                        <TableCell
                          key={`cell-${columnIndex}`}
                          sx={{ fontSize: "15px" }}
                          style={{ color: statusAttributes[row[column]].color }}
                        >
                          {statusAttributes[row[column]].description}
                        </TableCell>
                      );
                    }

                    return (
                      <TableCell
                        key={`cell-${columnIndex}`}
                        sx={{ fontSize: "15px" }}
                      >
                        {row[column]}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Stack>
  );
}


