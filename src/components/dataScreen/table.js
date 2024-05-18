import * as React from 'react';
import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { notify, stableSort, getComparator, ScrollbarDesign } from '../../utils/index';
import { useContext } from 'react';
import { AppConstants } from '../../config/app-config';
import { Stack, Tooltip, TextField, Button, Box, InputAdornment } from '@mui/material';
import TableSortLabel from '@mui/material/TableSortLabel';
import IconButton from '@mui/material/IconButton';
import useBreakpoints from '../../components/useBreakPoints';
import { ShipmentManagementContext } from '../../context/ShipmentManagementContext';
import { BootstrapTooltip } from '../styledToolTips/BootstrapTooltip';
import TableRowsIcon from '@mui/icons-material/TableRows';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { isLongString, renderTableCell, getColumnStyles, getFilteredData } from '../../utils/shipmentManagement';
import { AppTheme } from '../../utils/theme';
import ActionButtonsGroup from '../shipmentComponents/ActionButtonsGroup';
import { listData } from '../../api/dataApi';

const FILTER_COLUMNS = ['store_no', 'status']

export default function DataScreenTable() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    const [filterHeaderData, setFilterHeaderData] = useState({});
    const [isTableDense, setIsTableDense] = useState(true);

    const { isXs, isSm, isMd, isLg, isXl } = useBreakpoints();
    const responsiveFontSize = isXs ? "9px" : isSm ? "10px" : isMd ? "11px" : isLg ? "13px" : isXl ? "15px" : "18px";
    const responsiveWidthSize = isXs ? "45px" : isSm ? "55px" : isMd ? "55px" : isLg ? "80px" : isXl ? "150px" : "250px";

    const { clearShipmentManagementContext, clearShipmentManagementData, isContainersLoading, setIsContainersLoading,
        containersList, setContainersList,
        displayName, setDisplayName,
        displayAttribute, setDisplayAttribute,
        facilityList, setFacilityList,
        dockList, setDockList,
        dcList, setDcList,
        transporterList, setTransporterList,
        paginationToken, setPaginationToken,
        requestLoading, setRequestLoading,
        statusAttributes, setStatusAttributes, } = useContext(ShipmentManagementContext);

    useEffect(() => {
        (async () => {
            try {
                if (isContainersLoading) {
                    const response = await listData();
                    if (response) {
                        setContainersList(response.transfers);
                        setDisplayName(response.display_name)
                        setDisplayAttribute(response.display_attribute);
                        setStatusAttributes(response.status_attributes);

                        if (response.paginationToken) {
                            setPaginationToken(response.paginationToken)
                        } else {
                            setPaginationToken(null)
                        }
                    }
                }
            } catch (e) {
                notify(AppConstants.ERROR, e);
            } finally {
                if (isContainersLoading) {
                    setIsContainersLoading(false);
                }
                if (requestLoading) {
                    setRequestLoading(false);
                }
            }
        })()
    }, [isContainersLoading]);

    useEffect(() => {
        return () => {
            clearShipmentManagementData()
        };
    }, []);

    useEffect(() => {
        if (containersList.length > 0) {
            setFilteredData(containersList);
        } else {
            setFilteredData([])
        }
    }, [containersList]);

    const handleRequestSort = (property) => {
        let newOrder = 'desc';
        if (orderBy === property && order === 'desc') {
            newOrder = 'asc';
        }
        setOrder(newOrder);
        setOrderBy(property);
    };

    const sortedRows = (rows) => {
        return stableSort(rows, getComparator(order, orderBy));
    };

    const getTransporter = (value) => {
        for (const t of transporterList) {
            if (t.entityID === value) {
                return t;
            }
        }
        return null;
    }

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
    }

    const handleFilterHeaderDataChange = (column, value) => {
        setFilterHeaderData((prevData) => {
            return { ...prevData, [column]: value }
        })
    }

    const clearFilterHeaderData = (column) => {
        setFilterHeaderData((prevData) => {
            return { ...prevData, [column]: '' }
        })
    }

    useEffect(() => {
        if (!filteredData) {
            return;
        }
        setFilteredData(getFilteredData(containersList, filterHeaderData, statusAttributes));
    }, [filterHeaderData, containersList]);

    return (
        // <Stack sx={{ width: "100%", alignItems: "center", overflowY: 'auto', ...ScrollbarDesign }} >
        <Stack sx={{ width: "100%", alignItems: "center", ...ScrollbarDesign }} >

            <ActionButtonsGroup
                isTableDense={isTableDense}
                setIsTableDense={setIsTableDense}
            />

            {/* sx={{ width: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }} */}
            <Paper square sx={{ width: '100%' }}>
                <TableContainer sx={{ ...ScrollbarDesign }}>
                    <Table stickyHeader size={isTableDense ? 'small' : ''} >

                        <TableHead>
                            <TableRow>
                                {displayAttribute.map((column) => {
                                    return <TableCell
                                        key={column}
                                        style={{
                                            fontSize: responsiveFontSize,
                                            fontWeight: 'bold',
                                            textAlign: 'center',
                                        }}
                                    >
                                        {FILTER_COLUMNS.includes(column) && 
                                            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                                <TextField 
                                                    size='small'
                                                    variant="standard"
                                                    label={`${displayName[column]}`} 
                                                    sx={{ maxWidth: '15ch', color: 'action.active', mr: 0.5, my: 0.5 }}
                                                    InputLabelProps={{
                                                        style: { fontSize: '0.8rem' }, 
                                                    }}
                                                    InputProps={{
                                                        endAdornment: (
                                                            filterHeaderData[column] && <InputAdornment position="end">
                                                                <IconButton edge="end" onClick={() => clearFilterHeaderData(column)}>
                                                                    <ClearIcon fontSize='small' />
                                                                </IconButton>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    value={filterHeaderData[column] || ''}
                                                    onChange={(e) => handleFilterHeaderDataChange(column, e.target.value)}
                                                />
                                                <Tooltip title="Filter" size='small'>
                                                    <IconButton>
                                                        <FilterListIcon fontSize='small' sx={{ color: 'action.active' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        }
                                    </TableCell>
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
                                            fontWeight: 'bold',
                                            height: 0,
                                            // color: 'white !important',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <TableSortLabel
                                            active={true}
                                            direction={orderBy === column ? order : 'asc'}
                                            onClick={() => handleRequestSort(column)}
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
                            {sortedRows(filteredData)
                                // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, rowIndex) => (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={`row-${rowIndex}`}
                                    >
                                        {displayAttribute.map((column, columnIndex) => {
                                            if (column === 'status') {
                                                return (<TableCell 
                                                    key={`cell-${columnIndex}`}
                                                    sx={{ height: '0px', fontSize: responsiveFontSize }}
                                                    style={{ 
                                                        ...getColumnStyles(column),
                                                    }}>
                                                        <span style={{ background: statusAttributes[row[column]].color, color: 'white', borderRadius: '3px', padding: '2px' }}>
                                                            { renderTableCell(column, statusAttributes[row[column]].description) }
                                                        </span>
                                                </TableCell>)
                                            }

                                            return (<TableCell 
                                                key={`cell-${columnIndex}`}
                                                sx={{ height: '0px', fontSize: responsiveFontSize }}
                                                style={{ 
                                                    ...getColumnStyles(column),
                                                }}>
                                                    {
                                                        (isLongString(row[column]) ?
                                                            <BootstrapTooltip arrow title={row[column]}>
                                                                {renderTableCell(column, row[column])}
                                                            </BootstrapTooltip>
                                                            :
                                                            renderTableCell(column, row[column])
                                                        )
                                                    }
                                            </TableCell>)
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

            <div style={{ width: '100%', padding: '10px' }}>
                {/* <span style={{ margin: '5px' }}>Total rows: {filteredData ? filteredData.length : 0}</span> */}
                <Button variant="text" startIcon={<TableRowsIcon />} size='small' sx={{marginRight: 1, color: 'grey'}}>
                    Total rows: {filteredData ? filteredData.length : 0}
                </Button>
                {paginationToken && 
                    <Button variant="outlined" startIcon={<BrowserUpdatedIcon />} sx={{marginRight: 1}} onClick={loadMoreData}  size='small'>
                    Load more
                </Button>
                }
            </div>

        </ Stack >
    );
}
