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
import { UserManagementContext } from '../../context/UserManagementContext';
import { Stack, Tooltip, Typography, MenuItem, Select, Input } from '@mui/material';
import TableSortLabel from '@mui/material/TableSortLabel';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import useBreakpoints from '../../components/useBreakPoints';
import SearchUser from './searchUser';
import { allUsers, addUser, allRoles, updateUser } from '../../api/index'
import { AppTheme } from '../../utils/theme';
import TablePaginationActions from './TablePaginationActions';

function renderTableCell(column, value) {
    return value !== null ? value || value : "";
}

const getColumnStyles = (column) => {
    switch (column) {
        case 'roleId':
        case 'actions':
            return { textAlign: 'center' };
        default:
            return {};
    }
};

export default function UsersInfo() {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [editingRows, setEditingRows] = useState({});
    const [selectedRoleId, setSelectedRoleId] = useState('');
    const [editedValues, setEditedValues] = useState({});
    const [addingRow, setAddingRow] = useState(false);
    
    const { 
        usersLoading, setUsersLoading, 
        userList, setUsersList, 
        requestLoading, setRequestLoading, 
        paginationToken, setPaginationToken, 
        page, setPage,
        rowsPerPage, setRowsPerPage,
        maxPageNo, setMaxPageNo, 
        clearUserManagementContext } = useContext(UserManagementContext);
    
        const { isXs, isSm, isMd, isLg, isXl } = useBreakpoints();
    const responsiveFontSize = isXs ? "9px" : isSm ? "10px" : isMd ? "11px" : isLg ? "13px" : isXl ? "15px" : "18px";
    const responsiveWidthSize = isXs ? "45px" : isSm ? "55px" : isMd ? "55px" : isLg ? "80px" : isXl ? "150px" : "250px";
    const [searchUserEmail, setSearchUserEmail] = useState('');
    const [rolesList, setRolesList] = useState([]);
    const [newRow, setNewRow] = useState({
        email: '',
        userName: '',
        roleId: '',
    });
    const [displayName, setDisplayName] = useState([])
    const userManagementPermissions = checkRoleAccess("USER MANAGEMENT");

    useEffect(() => {
        (async () => {
            try {
                if (usersLoading) {
                    setSearchUserEmail('');
                    const response = await allUsers(rowsPerPage, paginationToken);
                    const rolesResponse = await allRoles();
                    if (response) {
                        if (page > maxPageNo) {
                            setMaxPageNo(page);
                            setUsersList(prev => {
                                return [...prev, ...response.users]
                            });
                        } else {
                            setUsersList(response.users);
                        }
                        setDisplayName(response.display_name)
                        setPaginationToken(response.paginationToken);
                    }
                    if (rolesResponse) {
                        setRolesList(rolesResponse.roles);
                    }
                }
            } catch (e) {
                notify(AppConstants.ERROR, "Couldn't fetch users info");
            }
            finally {
                if (usersLoading) {
                    setUsersLoading(false);
                }
                if (requestLoading) {
                    setRequestLoading(false);
                }
            }
        })()
    }, [usersLoading]);

    const columnOrder = ['email', 'userName', 'roleId', ...(addingRow || selectedRow ? ['password'] : []), 'actions'];

    const handleEditClick = (row) => {
        if (selectedRow && selectedRow.userId !== row.userId) {
            // If another row is already open, close it before opening the new one
            setEditingRows((prevEditingRows) => ({
                ...prevEditingRows,
                [selectedRow.userId]: false,
            }));
            setEditedValues((prevEditedValues) => {
                const newEditedValues = { ...prevEditedValues };
                delete newEditedValues[selectedRow.userId];
                return newEditedValues;
            });
        }

        // Check if "Add User" section is open and close it
        if (addingRow) {
            setAddingRow(false);
            setNewRow({
                email: '',
                userName: '',
                roleId: '',
            });
        }

        setSelectedRow(row);
        setEditingRows((prevEditingRows) => ({
            ...prevEditingRows,
            [row.userId]: true,
        }));
    };


    const handleDiscardClick = (row) => {
        if (addingRow) {
            setAddingRow(false);
            setNewRow({
                email: '',
                userName: '',
                roleId: '',
            });
        } else {
            setEditingRows((prevEditingRows) => ({
                ...prevEditingRows,
                [row.userId]: false,
            }));
            setEditedValues((prevEditedValues) => {
                const newEditedValues = { ...prevEditedValues };
                delete newEditedValues[row.userId];
                return newEditedValues;
            });
            setSelectedRow(null);
        }
    };

    const handleSaveClick = async (row) => {
        try {
            setRequestLoading(true);

            if (addingRow) {
                const userData = {
                    userName: newRow.userName,
                    userId: newRow.userName,
                    email: newRow.email,
                    password: newRow.password,
                    roleId: newRow.roleId,
                    isActive: true
                };

                const response = await addUser(userData);
                console.log("response in add user is", response)
                if (response && response.status === 200) {
                    clearUserManagementContext();
                    notify(AppConstants.SUCCESS, "New user details added");
                    setAddingRow(false);
                    setEditingRows({});
                    setEditedValues({});
                    setSelectedRow(null);
                } else {
                    notify(AppConstants.ERROR, response?.message);
                }
            } else {
                const updatedValues = editedValues[row.userId] || {};

                const userData = {
                    userName: updatedValues.userName || row.userName,
                    userId: updatedValues.userName || row.userName,
                    email: updatedValues.email || row.email,
                    password: updatedValues.password || "",
                    roleId: updatedValues.roleId || row.roleId,
                    isActive: true,
                };

                const response = await updateUser(userData);

                if (response && response.status === 200) {
                    clearUserManagementContext();
                    notify(AppConstants.SUCCESS, "User details updated");
                    setAddingRow(false);
                    setEditingRows({});
                    setEditedValues({});
                    setSelectedRow(null);
                } else {
                    notify(AppConstants.ERROR, response?.message);
                }
            }
        } catch (error) {
            notify(AppConstants.ERROR, error.message);
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
            const userData = {
                userName: row.userName,
                userId: row.userId,
                email: row.email,
                password: "",
                roleId: row.roleId,
                isActive: false,
            };
            const response = await updateUser(userData);
            if (response.status === 200) {
                notify(AppConstants.SUCCESS, "User details deleted");
                setTimeout(() => {
                    clearUserManagementContext();
                }, 3000);
            }
        }
        catch (error) {
            notify(AppConstants.ERROR, "Failed to delete user details");
            setRequestLoading(false);
        }
    };

    const handleAddUsersClick = () => {
        setAddingRow(true);
        setNewRow({
            email: '',
            userName: '',
            roleId: '',
            password: '',
        });
        setEditingRows({
            newRow: true,
        });
        setEditedValues({
            newRow: {
                email: '',
                userName: '',
                roleId: '',
                password: ''
            },
        });

        setSelectedRoleId('');
    };

    const handleChange = (rowId, field, value) => {
        setEditedValues((prevEditedValues) => ({
            ...prevEditedValues,
            [rowId]: {
                ...prevEditedValues[rowId],
                [field]: value,
            },
        }));

        // Update the new row state when changing the role in the dropdown
        if (field === 'roleId' && rowId === 'newRow') {
            setNewRow((prev) => ({ ...prev, roleId: value }));
        }
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

    const handleChangePage = (e, newPage) => {
        setPage(newPage);
        if(newPage > maxPageNo) {
            setUsersLoading(true);
        }
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
        setMaxPageNo(0);
        setPaginationToken(null);
        setUsersLoading(true);
    };

    const filteredData = userList.filter((row) => {
        const itemId = row.email;
        const normalizedSearchText = searchUserEmail;
        if (itemId.toString().startsWith(normalizedSearchText)) {
            return row;
        }
    });

    return (
        <Stack style={{position: 'relative'}} sx={{ width: "100%", alignItems: "center", rowGap: 1.5, overflowX: 'hidden', overflowY: 'auto', ...ScrollbarDesign }} >
            <Paper sx={{ width: '95%', overflow: 'hidden', mt: 2, mb: 2, display: 'flex', flexDirection: 'column' }}>
                <Stack justifyContent="space-between" direction="row" marginTop="-10px">
                    <SearchUser onSearch={setSearchUserEmail} setPage={setPage} />
                    {userManagementPermissions.create && (
                        <Tooltip title="Add new user" arrow>
                            <AddCircleIcon onClick={handleAddUsersClick} sx={{ padding: '8px', fontSize: '3rem', color: '#4870D6', cursor: 'pointer', marginTop: '15px' }} />
                        </Tooltip>
                    )}
                </Stack>
                <TableContainer sx={{ flex: 1, ...ScrollbarDesign }}>
                    <Table stickyHeader aria-label="sticky table" size='small'>
                        <TableHead>
                            <TableRow style={{ padding: '2px' }}>
                                {columnOrder.map((column) => (
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
                                        {column === 'actions' ? 'Actions' : (
                                            <TableSortLabel
                                                active={true}
                                                direction={orderBy === column ? order : 'asc'}
                                                onClick={() => handleRequestSort(column)}
                                                // style={{ color: 'white' }}
                                                // sx={{ '& svg': { color: 'white !important' } }}
                                            >
                                                {displayName[column] || column}
                                            </TableSortLabel>
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {/* Empty row when addingRow is true */}
                            {addingRow && (
                                <TableRow>
                                    {columnOrder.map((column, columnIndex) => (
                                        <TableCell key={`empty-cell-${columnIndex}`} textAlign="left" sx={{ height: '10px', fontSize: responsiveFontSize, }} style={{ ...getColumnStyles(column), padding: '4px' }}>
                                            {column === 'actions' ? (
                                                <>
                                                    <Tooltip title="Save" arrow>
                                                        <IconButton onClick={() => handleSaveClick('newRow')}>
                                                            <SaveIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Cancel" arrow>
                                                        <IconButton onClick={() => handleDiscardClick('newRow')}>
                                                            <CancelIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </>
                                            ) : (
                                                column === 'roleId' ? (
                                                    <Select
                                                        value={newRow.roleId}
                                                        onChange={(e) => setNewRow((prev) => ({ ...prev, roleId: e.target.value }))}
                                                        style={{ ...getColumnStyles(column), padding: '4px', height: '40px', borderRadius: '2px', width: '220px', minWidth: '180px', color: 'black', fontSize: responsiveFontSize }}
                                                        displayEmpty
                                                        // input={<Input />}
                                                        renderValue={(selected) => (
                                                            <Typography >
                                                                {selected === '' ? 'Select Role Id' : selected}
                                                            </Typography>
                                                        )}
                                                    >
                                                        {rolesList.map((role) => (
                                                            <MenuItem key={role.roleId} value={role.roleId}>
                                                                {role.roleId}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={newRow[column] || ''}
                                                        style={{ padding: '8px' }}
                                                        placeholder='Enter value'
                                                        onChange={(e) => setNewRow((prev) => ({ ...prev, [column]: e.target.value }))}
                                                    />
                                                )
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            )}

                            {/* Existing rows */}
                            {sortedRows(filteredData)
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, rowIndex) => (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={`row-${rowIndex}`}
                                    >
                                        {columnOrder.map((column, columnIndex) => (
                                            <TableCell key={`cell-${columnIndex}`}
                                                align="left" sx={{ height: '40px', fontSize: responsiveFontSize }}
                                                style={{
                                                    ...getColumnStyles(column), padding: '4px'
                                                }}>
                                                {column === 'actions' ? (
                                                    <>
                                                        {editingRows[row.userId] ? (
                                                            <>
                                                                <Tooltip title="Save" arrow>
                                                                    <IconButton onClick={() => handleSaveClick(row)}>
                                                                        <SaveIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="Cancel" arrow>
                                                                    <IconButton onClick={() => handleDiscardClick(row)}>
                                                                        <CancelIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </>
                                                        ) : (
                                                            <>
                                                                {userManagementPermissions.create && (
                                                                    <>
                                                                        <Tooltip title="Modify" arrow>
                                                                            <IconButton onClick={() => handleEditClick(row)}>
                                                                                <EditIcon />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </>
                                                                )}
                                                                {userManagementPermissions.delete && (
                                                                    <Tooltip title="Delete" arrow>
                                                                        <IconButton onClick={() => handleDeleteClick(row)}>
                                                                            <DeleteIcon />
                                                                        </IconButton>
                                                                    </Tooltip>

                                                                )}
                                                            </>

                                                        )

                                                        }
                                                    </>
                                                ) : (
                                                    editingRows[row.userId] ? (
                                                        column === 'roleId' ? (
                                                            <Select
                                                                value={editedValues[row.userId]?.roleId || row.roleId}
                                                                onChange={(e) => handleChange(row.userId, 'roleId', e.target.value)}
                                                                style={{ ...getColumnStyles(column), padding: '4px', height: '40px', borderRadius: '2px', width: '220px', minWidth: '180px', color: 'black', fontSize: responsiveFontSize }}
                                                            >
                                                                {rolesList.map((role) => (
                                                                    <MenuItem key={role.roleId} value={role.roleId}>
                                                                        {role.roleId}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        ) : (
                                                            <input
                                                                type="text"
                                                                value={editedValues[row.userId]?.[column] || row[column]}
                                                                style={{ padding: '8px' }}
                                                                onChange={(e) => handleChange(row.userId, column, e.target.value)}
                                                                disabled={editingRows[row.userId] && (column === 'email' || column === 'userName')}
                                                            />
                                                        )
                                                    ) : (
                                                        renderTableCell(column, row[column])

                                                    )
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}


                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[25, 50, 100, 200]}
                    component="div"
                    count={filteredData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={(tablePaginationProps) => (
                        <TablePaginationActions 
                            {...tablePaginationProps} 
                            paginationToken={paginationToken} 
                            maxPageNo={maxPageNo}
                        />
                      )}
                />
            </Paper>
        </ Stack >
    );
}  

