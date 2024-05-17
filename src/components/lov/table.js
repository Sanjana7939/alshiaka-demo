import * as React from 'react';
import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { notify, stableSort, getComparator, ScrollbarDesign, checkRoleAccess } from '../../utils/index';
import { useContext } from 'react';
import { AppConstants } from '../../config/app-config';
import { LovContext } from '../../context/LovContext';
import { Stack, Tooltip, TextField, Autocomplete } from '@mui/material';
import TableSortLabel from '@mui/material/TableSortLabel';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import useBreakpoints from '../../components/useBreakPoints';
import { renderTableCell, getColumnStyles, isLongString, fieldValidation } from '../../utils/shipmentManagement';
import { AppTheme } from '../../utils/theme';
import { crudLov, lovEntityType } from '../../api/pod';
import SearchLov from './searchLov';
import { BootstrapTooltip } from '../styledToolTips/BootstrapTooltip';
import { lovEntityTypes, testEmails } from './utils';

export default function LovInfo() {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState(null);

    const defaultRow = {
        entityType: '',
        entityID: '',
        entityDesc: '',
    };

    const [selectedRow, setSelectedRow] = useState(null);
    const [newRow, setNewRow] = useState(defaultRow);
    const [addingNewRow, setAddingNewRow] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedLovEntityType, setSelectedLovEntityType] = useState(lovEntityTypes[0]);

    const { lovLoading, setLovLoading, lovList, setLovList, requestLoading, setRequestLoading, page, setPage, rowsPerPage, setRowsPerPage, lovSearchText } = useContext(LovContext);
    const { isXs, isSm, isMd, isLg, isXl } = useBreakpoints();
    const responsiveFontSize = isXs ? "9px" : isSm ? "10px" : isMd ? "11px" : isLg ? "13px" : isXl ? "15px" : "18px";
    const responsiveWidthSize = isXs ? "45px" : isSm ? "55px" : isMd ? "55px" : isLg ? "80px" : isXl ? "150px" : "250px";

    const [searchUserEmail, setSearchUserEmail] = useState('');
    const [displayName, setDisplayName] = useState({
        entityType: 'Entity Type',
        entityID: 'Entity ID',
        entityDesc: 'Entity Desc',
    })

    const userPermissions = checkRoleAccess("USER MANAGEMENT");

    const columnOrder = ['entityType', 'entityID', 'entityDesc'];

    const handleEditClick = (row) => {
        // Check if "Add LOV" section is open and close it
        if (addingNewRow) {
            setAddingNewRow(false);
            setNewRow(defaultRow);
        }
        setSelectedRow(row);
    };

    const handleDiscardClick = () => {
        if (addingNewRow) {
            setAddingNewRow(false);
            setNewRow(defaultRow);
            return;
        }

        setSelectedRow(null);
    };

    const handleSaveClick = async () => {
        try {
            setRequestLoading(true);
            let data = {}
            if (addingNewRow) {
                const { entityType, entityID, entityDesc } = newRow;
                if (!fieldValidation({ entityType, entityID, entityDesc }, displayName)) {
                    return;
                }

                if (entityType === 'EMAIL' && !testEmails(entityDesc)) {
                    notify(AppConstants.ERROR, "Enter valid comma separated emails");
                    return;
                }
                data = {
                    type: 'CREATE',
                    body: {
                        entityType,
                        entityID,
                        entityDesc,
                    }
                };
            } else {
                const { entityType, entityID, entityDesc } = selectedRow;
                if (!fieldValidation({ entityType, entityID, entityDesc }, displayName)) {
                    return;
                }
                if (entityType === 'EMAIL' && !testEmails(entityDesc)) {
                    notify(AppConstants.ERROR, "Enter valid comma separated emails");
                    return;
                }
                data = {
                    type: 'UPDATE',
                    body: {
                        entityType,
                        entityID,
                        entityDesc,
                    }
                };
            }

            console.log(data)
            const response = await crudLov(data);

            if (addingNewRow) {
                notify(AppConstants.SUCCESS, "LOV added successfully");
                setSelectedLovEntityType(lovEntityTypes.find(obj => obj.name === newRow.entityType))
            } else {
                notify(AppConstants.SUCCESS, "LOV updated successfully");
            }
            
            setLovLoading(true);
            setAddingNewRow(false);
            setNewRow(defaultRow);
            setSelectedRow(null);
        } catch (e) {
            notify(AppConstants.ERROR, e);
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
            const data = {
                type: "DELETE",
                body: {
                    entityID: row.entityID,
                    entityType: row.entityType,
                }
            }
            const response = await crudLov(data);
            console.log('deleteeee====', response)
            notify(AppConstants.SUCCESS, "LOV deleted");
            setLovLoading(true);
        }
        catch (e) {
            notify(AppConstants.ERROR, e || "Failed to delete LOV");
        } finally {
            setRequestLoading(false);
        }
    };

    const handleAddUsersClick = () => {
        setAddingNewRow(true);
        setNewRow(defaultRow);
        setSelectedRow(null);
    };

    const handleChange = (field, value) => {
        if (addingNewRow) {
            setNewRow((prevValues) => ({
                ...prevValues,
                [field]: value,
            }));
            return;
        }
        setSelectedRow((prevValues) => ({
            ...prevValues,
            [field]: value,
        }));
    };


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

    // const filteredData = lovList.filter((row) => {
    //     // const itemId = row.email;
    //     // const normalizedSearchText = searchUserEmail;
    //     // if (itemId.toString().startsWith(normalizedSearchText)) {
    //     //     return row;
    //     // }

    //     return row;
    // });

    useEffect(() => {
        if (!lovSearchText) {
            setFilteredData(lovList);
            return;
        }
        const data = lovList.filter((row) => {
            if (row.entityID.toLowerCase().startsWith(lovSearchText.toLowerCase())) {
                return row;
            }
        });
        setFilteredData(data);
        setPage(0);
        console.log(lovSearchText)
    }, [lovList, lovSearchText])

    const isRowSelected = (entityID) => {
        return (selectedRow && selectedRow.entityID === entityID)
    }

    return (
        <Stack style={{ position: 'relative' }} sx={{ width: "100%", alignItems: "center", rowGap: 1.5, overflowX: 'hidden', overflowY: 'auto', ...ScrollbarDesign }} >
            <Paper sx={{ width: '95%', overflow: 'hidden', mt: 2, mb: 2, display: 'flex', flexDirection: 'column' }}>
                
                <Stack display="flex" direction="row">
                    <SearchLov setAddingNewRow={setAddingNewRow} setSelectedRow={setSelectedRow} selectedLovEntityType={selectedLovEntityType} setSelectedLovEntityType={setSelectedLovEntityType} />
                    {userPermissions.create && (
                        <Tooltip title="Add new entity" arrow>
                            <AddCircleIcon onClick={handleAddUsersClick} sx={{ padding: '8px', fontSize: '3rem', color: '#4870D6', cursor: 'pointer', marginTop: '5px' }} />
                        </Tooltip>
                    )}
                </Stack>

                <TableContainer sx={{ flex: 1, ...ScrollbarDesign }}>
                    <Table stickyHeader aria-label="sticky table" size='small'>
                        <TableHead>
                            <TableRow style={{ padding: '2px' }}>
                                {columnOrder.map((column) => {
                                    return (
                                        <TableCell
                                            key={column}
                                            align='left'
                                            style={{
                                                width: column === 'email' ? `calc(${responsiveWidthSize}*1.75)` : responsiveWidthSize,
                                                backgroundColor: AppTheme.tableHeaderColor,
                                                fontSize: responsiveFontSize,
                                                fontWeight: 'bold',
                                                height: 10,
                                                // color: 'white',
                                                ...getColumnStyles(column),
                                            }}
                                        >
                                            <TableSortLabel
                                                active={true}
                                                direction={orderBy === column ? order : 'asc'}
                                                onClick={() => handleRequestSort(column)}
                                            // style={{ color: 'white' }}
                                            // sx={{ '& svg': { color: 'white !important' } }}
                                            >
                                                {displayName[column] || column}
                                            </TableSortLabel>
                                        </TableCell>
                                    )
                                })}
                                {
                                    userPermissions.update && <TableCell
                                        key='action'
                                        align='left'
                                        style={{
                                            width: responsiveWidthSize,
                                            backgroundColor: AppTheme.tableHeaderColor,
                                            fontSize: responsiveFontSize,
                                            fontWeight: 'bold',
                                            height: 10,
                                            // color: 'white',
                                            ...getColumnStyles('action'),
                                        }}
                                    >
                                        Action
                                    </TableCell>
                                }
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {/* Empty row when addingNewRow is true */}
                            {addingNewRow && 
                                <GetAddNewTableRow 
                                    rowIndex='new-row'
                                    columnOrder={columnOrder}
                                    userPermissions={userPermissions}
                                    responsiveFontSize={responsiveFontSize}
                                    newRow={newRow}
                                    handleSaveClick={handleSaveClick}
                                    handleDiscardClick={handleDiscardClick}
                                    handleChange={handleChange}
                                />
                            }

                            {/* Existing rows */}
                            {sortedRows(filteredData)
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, rowIndex) => (
                                    <GetTableRow 
                                        rowIndex={rowIndex}
                                        row={row}
                                        columnOrder={columnOrder}
                                        isRowSelected={isRowSelected}
                                        userPermissions={userPermissions}
                                        responsiveFontSize={responsiveFontSize}
                                        selectedRow={selectedRow}
                                        handleSaveClick={handleSaveClick}
                                        handleDiscardClick={handleDiscardClick}
                                        handleEditClick={handleEditClick}
                                        handleDeleteClick={handleDeleteClick}
                                        handleChange={handleChange}
                                    />
                                ))}


                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={filteredData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </ Stack >
    );
}


const GetTableRow = ({rowIndex, row, columnOrder, isRowSelected, userPermissions, responsiveFontSize, selectedRow, handleSaveClick, handleDiscardClick, handleEditClick, handleDeleteClick, handleChange}) => {
    return (
        <TableRow
            hover
            tabIndex={-1}
            key={`row-${rowIndex}`}
        >
            {columnOrder.map((column, columnIndex) => {
                if (isRowSelected(row.entityID) && (column === 'entityType' || column === 'entityID' || column === 'entityDesc')) {
                    return (<TableCell
                        key={`cell-${columnIndex}`}
                        sx={{ height: '0px', fontSize: responsiveFontSize }}
                        style={{ ...getColumnStyles(column) }}>
                        <TextField
                            disabled={(column === 'entityType' || column === 'entityID')}
                            sx={{ width: '25ch' }}
                            size='small'
                            variant="standard"
                            value={selectedRow[column]}
                            placeholder={`Enter ${column}`}
                            onChange={(e) => handleChange(column, e.target.value)}
                        />
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

                    {isRowSelected(row.entityID) ? (
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
        </TableRow>
    );
}

const GetAddNewTableRow = ({rowIndex, columnOrder, userPermissions, responsiveFontSize, newRow, handleSaveClick, handleDiscardClick, handleChange}) => {
    return (
        <TableRow
            hover
            tabIndex={-1}
            key={`row-${rowIndex}`}
        >
            {columnOrder.map((column, columnIndex) => {
                if ((column === 'entityType')) {
                    return (<TableCell
                        key={`cell-${columnIndex}`}
                        sx={{ height: '0px', fontSize: responsiveFontSize }}
                        style={{ ...getColumnStyles(column) }}>
                        <Autocomplete
                            sx={{ width: '25ch' }}
                            isOptionEqualToValue={(option, value) => option.name === value.name}
                            value={newRow[column] ? { name: newRow[column] } : null }
                            onChange={(e, newValue) => handleChange(column, newValue?.name || '')}
                            options={lovEntityTypes}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => <TextField {...params} variant="standard" size='small' />}
                        />
                    </TableCell>)
                }
                if ((column === 'entityID' || column === 'entityDesc')) {
                    return (<TableCell
                        key={`cell-${columnIndex}`}
                        sx={{ height: '0px', fontSize: responsiveFontSize }}
                        style={{ ...getColumnStyles(column) }}>
                        <TextField
                            sx={{ width: '25ch' }}
                            size='small'
                            variant="standard"
                            value={newRow[column]}
                            placeholder={`Enter ${column}`}
                            onChange={(e) => handleChange(column, e.target.value)}
                        />
                    </TableCell>)
                }
            })}

            <TableCell
                key={`cell-action`}
                sx={{ height: '0px', fontSize: responsiveFontSize }}
                style={{ ...getColumnStyles('action') }}>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {userPermissions.create &&
                        // <Tooltip title="Save" arrow size='small'>
                        <IconButton onClick={() => handleSaveClick(newRow)}>
                            <SaveIcon fontSize='small' />
                        </IconButton>
                        // </Tooltip>
                    }
                    {userPermissions.create &&
                        // <Tooltip title="Cancel" arrow size='small'>
                        <IconButton onClick={() => handleDiscardClick()}>
                            <CancelIcon fontSize='small' />
                        </IconButton>
                        // </Tooltip>
                    }
                </div>

            </TableCell>
        </TableRow>
    );
}