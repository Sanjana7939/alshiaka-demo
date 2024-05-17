import * as React from 'react';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { notify, stableSort, getComparator, ScrollbarDesign, checkRoleAccess, muiDateFormat } from '../../utils/index';
import { useContext } from 'react';
import { AppConstants } from '../../config/app-config';
import { CircularProgress, Stack, Tooltip, Typography, Menu, MenuItem, Select, Input, TextField, LinearProgress, Skeleton, Button, FormGroup, FormControlLabel, Switch, Box, InputAdornment, Autocomplete } from '@mui/material';
import TableSortLabel from '@mui/material/TableSortLabel';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import useBreakpoints from '../../components/useBreakPoints';
import { ShipmentManagementContext } from '../../context/ShipmentManagementContext';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { listShipments, updateContainer } from '../../api/shipmentManagement';
import { lovEntityType } from '../../api/pod';
import { Auth } from 'aws-amplify';
import { BootstrapTooltip } from '../styledToolTips/BootstrapTooltip';
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import TableRowsIcon from '@mui/icons-material/TableRows';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import { isLongString, renderTableCell, getColumnStyles, getFilteredData, fieldValidation, getEntityDesc } from '../../utils/shipmentManagement';
import { AppTheme } from '../../utils/theme';
import ActionButtonsGroup from '../shipmentComponents/ActionButtonsGroup';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

const FILTER_COLUMNS = ['container_id', 'mode', 'status', 'asn_no', 'facility_id']
const SHIPMENT_TYPE = 'planning';

export default function PlanningScreenTable() {
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
    const userPermissions = checkRoleAccess("PLANNING");

    const { clearShipmentManagementContext, clearShipmentManagementData, isContainersLoading, setIsContainersLoading,
        containersList, setContainersList,
        displayName, setDisplayName,
        displayAttribute, setDisplayAttribute,
        facilityList, setFacilityList,
        dockList, setDockList,
        dcList, setDcList,
        paginationToken, setPaginationToken,
        requestLoading, setRequestLoading,
        statusAttributes, setStatusAttributes, } = useContext(ShipmentManagementContext);

    useEffect(() => {
        (async () => {
            try {
                if (isContainersLoading) {
                    const response = await listShipments(SHIPMENT_TYPE, paginationToken);
                    if (response) {
                        setContainersList(response.data.transfers);
                        setDisplayName(response.data.display_name)
                        setDisplayAttribute(response.data.display_attribute);
                        setStatusAttributes(response.data.status_attributes);

                        if (response.data.paginationToken) {
                            setPaginationToken(response.data.paginationToken)
                        } else {
                            setPaginationToken(null)
                        }
                    }

                    if (!dockList || dockList.length === 0) {
                        const lovResponse = await lovEntityType('DOCK');
                        setDockList(lovResponse.entities)
                    }
                    if (!dcList || dcList.length === 0) {
                        const lovResponse = await lovEntityType('DC');
                        setDcList(lovResponse.entities)
                    }
                    if (!facilityList || facilityList.length === 0) {
                        const lovResponse = await lovEntityType('WH');
                        setFacilityList(lovResponse.entities)
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleSaveClick = async (row) => {
        const { location, placement_time, dock, remarks } = selectedRow;

        if (!fieldValidation({ location, placement_time, dock }, displayName)) {
            return;
        }

        try {
            setRequestLoading(true);

            const { username } = await Auth.currentUserInfo();

            const updateData = {
                container_id: row.container_id,
                facility_id: row.facility_id,
                container_type: row.upload_type,
                user_id: username,
                update_type: 'PP',
                location: location.entityID,
                placement_time: placement_time.utc().valueOf(), // converting to timestamp
                dock: dock.entityID,
                remarks,
                status: 'PLACEMENT_PROVIDED',
            }

            console.log('updateData', updateData);

            const response = await updateContainer(updateData);
            notify(AppConstants.SUCCESS, response.message);
            setIsContainersLoading(true);
            setSelectedRow(null);
            // setFilterHeaderData({});
            setPaginationToken(null);
        } catch (error) {
            notify(AppConstants.ERROR, error);
        } finally {
            setRequestLoading(false);
        }
    };

    const handleDeleteClick = async (row) => {
        if (!confirm(`Are you sure you want to delete?`)) {
            return;
        }
        try {
            setRequestLoading(true);

            const { username } = await Auth.currentUserInfo();

            const updateData = {
                container_id: row.container_id,
                facility_id: row.facility_id,
                container_type: row.upload_type,
                user_id: username,
                update_type: 'DELETE',
            }

            console.log('updateData', updateData);

            const response = await updateContainer(updateData);
            notify(AppConstants.SUCCESS, response.message);
            setIsContainersLoading(true);
            setSelectedRow(null);
            // setFilterHeaderData({});
            setPaginationToken(null);
        } catch (error) {
            notify(AppConstants.ERROR, error);
        } finally {
            setRequestLoading(false);
        }
    }

    const updateContainerSyncStatus = (PK) => {
        const data = containersList.map(container => {
            if (container.PK === PK) {
                return { ...container, wms_sync_status: 'N' }
            }
            return container;
        })
        setContainersList(data);
    }

    const handleWMSSyncClick = async (row) => {
        try {
            setRequestLoading(true);

            const { username } = await Auth.currentUserInfo();

            const updateData = {
                container_id: row.container_id,
                facility_id: row.facility_id,
                container_type: row.upload_type,
                user_id: username,
                update_type: 'WMS_SYNC',
            }

            console.log('updateData', updateData);

            const response = await updateContainer(updateData);
            notify(AppConstants.SUCCESS, response.message);

            updateContainerSyncStatus(row.PK);
        } catch (error) {
            notify(AppConstants.ERROR, error);
        } finally {
            setRequestLoading(false);
        }
    }

    const handleEditClick = (row) => {
        setSelectedRow({ ...row, placement_time: dayjs(new Date()) });
    };

    const handleDiscardClick = () => {
        setSelectedRow(null);
    };

    const handleChange = (field, value) => {
        setSelectedRow((prevValues) => ({
            ...prevValues,
            [field]: value,
        }));
    };

    const isRowSelected = (PK) => {
        return (selectedRow && selectedRow.PK === PK)
    }

    const loadMoreData = async () => {
        try {
            setRequestLoading(true);
            const response = await listShipments(SHIPMENT_TYPE, paginationToken);

            setContainersList((prev) => {
                let data = [...prev];
                return data.concat(response.data.transfers);
            });

            if (response.data.paginationToken) {
                setPaginationToken(response.data.paginationToken)
            } else {
                setPaginationToken(null)
            }
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
        setFilteredData(getFilteredData(containersList, filterHeaderData, statusAttributes, dcList, dockList, facilityList));
    }, [filterHeaderData, containersList]);

    const filteredDCList = () => {
        if (!selectedRow || !selectedRow.facility_id) {
            return [];
        }
        return dcList.filter((dc) => {
            if (dc.entityID.startsWith(selectedRow.facility_id)) {
                return dc;
            }
        })
    }

    const filteredDockList = () => {
        if (!selectedRow || !selectedRow.location) {
            return [];
        }
        return dockList.filter((dock) => {
            if (dock.entityID.startsWith(selectedRow.location.entityID)) {
                return dock;
            }
        })
    }

    // make the selected dock null when location is changed
    useEffect(() => {
        setSelectedRow(prev => {
            return { ...prev, dock: null };
        })
    }, [selectedRow?.location]);

    // const filteredDockList = () => {
    //     if (!selectedRow || !selectedRow.location) {
    //         return [];
    //     }
    //     return dockList.filter((dock) => {
    //         if (dock.entityID.startsWith(selectedRow.location)) {
    //             return dock;
    //         }
    //     })
    // }

    return (
        // sx={{ width: "100%", height: "100%" }}
        <Stack sx={{ width: "100%", alignItems: "center", overflowY: 'auto', ...ScrollbarDesign }} >
            {/* <Header title="Planning" /> */}
            {/* <Typography
                variant="h1"
                sx={{
                    whiteSpace: 'nowrap',
                    fontSize: `calc(${responsiveFontSize}*1.5)`,
                    width: "95%", textAlign: "left", fontWeight: "semibold",
                }}>
                Users
            </Typography> */}

            <ActionButtonsGroup
                SHIPMENT_TYPE={SHIPMENT_TYPE}
                setFilterHeaderData={setFilterHeaderData}
                isTableDense={isTableDense}
                setIsTableDense={setIsTableDense}
                filteredData={filteredData}
            />

            {/* sx={{ width: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }} */}
            <Paper square sx={{ width: '100%' }}>
                <TableContainer sx={{ ...ScrollbarDesign }}>
                    <Table sx={{ width: 'max-content' }} stickyHeader size={isTableDense ? 'small' : ''} >

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

                                            // <TextField
                                            //     size='small'
                                            //     sx={{ maxWidth: '15ch' }}
                                            //     placeholder={`Filter ${displayName[column]}`}
                                            //     value={filterHeaderData[column] || ''}
                                            //     onChange={(e) => handleFilterHeaderDataChange(column, e.target.value)}
                                            // />
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
                                {(userPermissions.update || userPermissions.delete) && <TableCell
                                    key='action'
                                    style={{
                                        // backgroundColor: '#4870D6',
                                        backgroundColor: AppTheme.tableHeaderColor,
                                        fontSize: responsiveFontSize,
                                        fontWeight: 'bold',
                                        height: 0,
                                        textAlign: 'center',
                                    }}
                                >
                                    Action
                                </TableCell>
                                }
                                <TableCell
                                    key='sync_status'
                                    style={{
                                        // backgroundColor: '#4870D6',
                                        backgroundColor: AppTheme.tableHeaderColor,
                                        fontSize: responsiveFontSize,
                                        fontWeight: 'bold',
                                        height: 0,
                                        textAlign: 'center',
                                    }}
                                >
                                    Sync Status
                                </TableCell>
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
                                            if (column === 'location' && isRowSelected(row.PK)) {
                                                return (<TableCell
                                                    key={`cell-${columnIndex}`}
                                                    sx={{ height: '0px', fontSize: responsiveFontSize }}
                                                    style={{ ...getColumnStyles(column) }}
                                                >
                                                    <Autocomplete
                                                        sx={{ width: '20ch' }}
                                                        value={selectedRow[column] || null}
                                                        onChange={(e, newValue) => handleChange(column, newValue)}
                                                        options={filteredDCList()}
                                                        getOptionLabel={(option) => option.entityDesc}
                                                        renderInput={(params) => <TextField {...params} variant="standard" size='small' />}
                                                    />
                                                </TableCell>)
                                            }
                                            if (column === 'dock' && isRowSelected(row.PK)) {
                                                return (<TableCell
                                                    key={`cell-${columnIndex}`}
                                                    sx={{ height: '0px', fontSize: responsiveFontSize }}
                                                    style={{ ...getColumnStyles(column) }}
                                                >
                                                    <Autocomplete
                                                        sx={{ width: '20ch' }}
                                                        noOptionsText={'Select a location to see docks'}
                                                        value={selectedRow[column] || null}
                                                        onChange={(event, newValue) => handleChange(column, newValue)}
                                                        options={filteredDockList()}
                                                        getOptionLabel={(option) => option.entityDesc}
                                                        renderInput={(params) => <TextField {...params} variant="standard" size='small' />}
                                                    />
                                                </TableCell>)
                                            }
                                            if (column === 'remarks' && isRowSelected(row.PK)) {
                                                return (<TableCell
                                                    key={`cell-${columnIndex}`}
                                                    sx={{ height: '0px', fontSize: responsiveFontSize }}
                                                    style={{ ...getColumnStyles(column) }}>
                                                    <TextField
                                                        sx={{ width: '25ch' }}
                                                        size='small'
                                                        variant="standard"
                                                        value={selectedRow[column]}
                                                        placeholder='Enter remarks'
                                                        onChange={(e) => handleChange(column, e.target.value)}
                                                    />
                                                </TableCell>)
                                            }
                                            if (column === 'placement_time' && isRowSelected(row.PK)) {
                                                return (<TableCell
                                                    key={`cell-${columnIndex}`}
                                                    sx={{ height: '0px', fontSize: responsiveFontSize }}
                                                    style={{ ...getColumnStyles(column) }}
                                                >
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DateTimePicker
                                                            size='small'
                                                            variant="standard"
                                                            format={muiDateFormat}
                                                            disablePast
                                                            viewRenderers={{
                                                                hours: renderTimeViewClock,
                                                                minutes: renderTimeViewClock,
                                                                seconds: renderTimeViewClock,
                                                            }}
                                                            slotProps={{
                                                                textField: {
                                                                    variant: 'standard',
                                                                    size: 'small',
                                                                    error: false
                                                                }
                                                            }}
                                                            value={dayjs(selectedRow[column])}
                                                            timezone={AppConstants.TIMEZONE}
                                                            onChange={(newValue) => handleChange(column, dayjs(newValue))}
                                                        />
                                                    </LocalizationProvider>
                                                </TableCell>)
                                            }

                                            if (column === 'status') {
                                                return (<TableCell
                                                    key={`cell-${columnIndex}`}
                                                    sx={{ height: '0px', fontSize: responsiveFontSize }}
                                                    style={{
                                                        ...getColumnStyles(column),
                                                    }}>
                                                    <span style={{ background: statusAttributes[row[column]].color, color: 'white', borderRadius: '3px', padding: '2px' }}>
                                                        {renderTableCell(column, statusAttributes[row[column]].description)}
                                                    </span>
                                                </TableCell>)
                                            }

                                            if (column === 'facility_id') {
                                                return (<TableCell
                                                    key={`cell-${columnIndex}`}
                                                    sx={{ height: '0px', fontSize: responsiveFontSize }}
                                                    style={{
                                                        ...getColumnStyles(column),
                                                    }}>
                                                    { renderTableCell(column, getEntityDesc(column, row[column], dcList, dockList, facilityList, null)) }
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

                                        {(userPermissions.update || userPermissions.delete) &&
                                            <TableCell
                                                key={`cell-action`}
                                                sx={{ height: '0px', fontSize: responsiveFontSize }}
                                                style={{ ...getColumnStyles('action') }}>

                                                {isRowSelected(row.PK) ? (
                                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                        {userPermissions.update &&
                                                            // <Tooltip title="Save" arrow size='small'>
                                                            <IconButton onClick={() => handleSaveClick(row)}>
                                                                <SaveIcon fontSize='small' />
                                                            </IconButton>
                                                            // </Tooltip>
                                                        }
                                                        {userPermissions.update &&
                                                            // <Tooltip title="Cancel" arrow size='small'>
                                                            <IconButton onClick={() => handleDiscardClick()}>
                                                                <CancelIcon fontSize='small' />
                                                            </IconButton>
                                                            // </Tooltip>
                                                        }
                                                    </div>
                                                ) : (
                                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                        {userPermissions.update &&
                                                            // <Tooltip title="Modify" arrow size='small'>
                                                            <IconButton onClick={() => handleEditClick(row)}>
                                                                <EditIcon fontSize='small' />
                                                            </IconButton>
                                                            // </Tooltip>
                                                        }
                                                        {userPermissions.delete &&
                                                            // <Tooltip title="Delete" arrow size='small'>
                                                            <IconButton onClick={() => handleDeleteClick(row)}>
                                                                <DeleteIcon fontSize='small' />
                                                            </IconButton>
                                                            // </Tooltip>
                                                        }
                                                    </div>
                                                )}

                                            </TableCell>
                                        }

                                        <TableCell
                                            key={`cell-wms_sync_status`}
                                            sx={{ height: '0px', fontSize: responsiveFontSize }}
                                            style={{
                                                ...getColumnStyles('wms_sync_status'),
                                            }}>
                                            <>
                                                {
                                                    (row['wms_sync_status'] === 'Y' ?
                                                        // <Tooltip title="WMS sync done" arrow size='small'>
                                                        <IconButton disabled>
                                                            <CloudDoneIcon color='success' />
                                                        </IconButton>
                                                        // </Tooltip>
                                                        :
                                                        // <Tooltip title="WMS sync not done" arrow size='small'>
                                                        <IconButton disabled>
                                                            <CloudOffIcon color='error' />
                                                        </IconButton>
                                                        // </Tooltip>
                                                    )
                                                }
                                                {userPermissions.update &&
                                                    <Tooltip title="Re-Sync" arrow size='small'>
                                                        <IconButton onClick={() => handleWMSSyncClick(row)}>
                                                            <CloudSyncIcon fontSize='small' />
                                                        </IconButton>
                                                    </Tooltip>
                                                }
                                            </>

                                        </TableCell>

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
                <Button variant="text" startIcon={<TableRowsIcon />} size='small' sx={{ marginRight: 1, color: 'grey' }}>
                    Total rows: {filteredData ? filteredData.length : 0}
                </Button>
                {paginationToken &&
                    <Button variant="outlined" startIcon={<BrowserUpdatedIcon />} sx={{ marginRight: 1 }} onClick={loadMoreData} size='small'>
                        Load more
                    </Button>
                }
            </div>

        </ Stack >
    );
}
