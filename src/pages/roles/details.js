import React, { useContext, useState, useEffect } from 'react';
import { Box, Stack, Typography, Switch, Divider, Button, CircularProgress } from '@mui/material';
import { ProductsContext } from '../../context/ProductContext';
import { AppTheme } from '../../utils/theme';
import { notify, checkRoleAccess } from '../../utils';
import { deleteRole, updateRole } from '../../api/index'
import { AppConstants } from '../../config/app-config';
import { AppContext } from '../../context/app-context';
import useBreakpoints from '../../components/useBreakPoints';

export const ProductDetailsPanel = ({ ...attributes }) => {
    const { selectedProduct } = useContext(ProductsContext);
    const { setRolesLoading } = useContext(AppContext)
    const [modifiedSwitches, setModifiedSwitches] = useState({});
    const [saveLoading, setSaveLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const { isXs, isSm, isMd, isLg, isXl, isSidebarCollapseBreakPoint } = useBreakpoints();
    const userManagementPermissions = checkRoleAccess('USER MANAGEMENT');
    const buttonWidth = isMd ? '105px' : isXs || isSm ? '105px' : '120px';
    const responsiveFontSize = isXs ? '15px' : isSm ? '15px' : isMd ? '20px' : isLg ? '13px' : isXl ? '15px' : '18px';
    
    useEffect(() => {
        // Update the modifiedSwitches state when selectedProduct changes
        if (selectedProduct && selectedProduct.operations) {
            const initialSwitches = {};
            selectedProduct.operations.forEach((operation) => {
                initialSwitches[operation.operationDesc] = {
                    create: operation.create,
                    read: operation.read,
                    update: operation.update,
                    delete: operation.delete,
                };
            });
            setModifiedSwitches(initialSwitches);
        }
    }, []);

    const handleSwitchChange = (operationId, property) => {
        // Update the modifiedSwitches state when a switch is changed
        setModifiedSwitches((prevSwitches) => {
            const operationSwitches = prevSwitches[operationId] || {};
            return {
                ...prevSwitches,
                [operationId]: {
                    ...operationSwitches,
                    [property]: !operationSwitches[property],
                },
            };
        });
    };

    const handleSave = async () => {
        setSaveLoading(true);
        // Update the selectedProduct with the modifiedSwitches
        const updatedOperations = selectedProduct.operations.map((operation) => {
            const modifiedSwitch = modifiedSwitches[operation.operationDesc] || {};
            const updatedOperation = { ...operation };

            if (modifiedSwitch.create !== undefined) {
                updatedOperation.create = modifiedSwitch.create;
            }
            if (modifiedSwitch.read !== undefined) {
                updatedOperation.read = modifiedSwitch.read;
            }

            if (modifiedSwitch.update !== undefined) {
                updatedOperation.update = modifiedSwitch.update;
            }

            if (modifiedSwitch.delete !== undefined) {
                updatedOperation.delete = modifiedSwitch.delete;
            }
            const binaryString = [
                updatedOperation.create ? '1' : '0',
                updatedOperation.read ? '1' : '0',
                updatedOperation.update ? '1' : '0',
                updatedOperation.delete ? '1' : '0',
            ].join('');

            console.log("binary string is", binaryString);
            // Convert binary string to hexadecimal
            updatedOperation.hexString = parseInt(binaryString, 2).toString(16).toUpperCase();

            return updatedOperation;
        });

        console.log("Updated Operations:", updatedOperations);

        // Call the updateRole API
        try {
            const response = await updateRole({
                roleId: selectedProduct.roleId,
                role: updatedOperations.map((op) => op.hexString).join(''),
                roleDesc: "XXXXX",
                updatedBy: selectedProduct.createdBy,
                isActive: true,
            });
            console.log("api call has been completed", response)
            if (response.status === 200) {
                console.log(1111111111, response.data.finalRole, response.data.finalRole.operations)

                // Use the API response to update the state
                if (response.data.finalRole && response.data.finalRole.operations) {
                    // Use the API response to update the state
                    console.log("Update successful!");
                    setModifiedSwitches(
                        response.data.finalRole.operations.reduce((acc, operation) => {
                            acc[operation.operationDesc] = {
                                create: operation.create,
                                read: operation.read,
                                update: operation.update,
                                delete: operation.delete,
                            };
                            return acc;
                        }, {})
                    );
                    notify(AppConstants.SUCCESS, `Role ${selectedProduct.roleId} updated`);
                }
                else {
                    console.log("Invalid response structure. Cannot update state.");
                    notify(AppConstants.ERROR, "Invalid response structure. Cannot update state.");
                }
            } else {
                console.log("Update failed.");
                notify(AppConstants.ERROR, response.message);
            }
        } catch (error) {
            // console.error("Error updating role:", error);
            notify(AppConstants.ERROR, "Error updating role");
        } finally {
            setSaveLoading(false);
        }
    };

    const handleDiscard = () => {
        // Reset the modifiedSwitches state
        setModifiedSwitches({});
        setRolesLoading(true)
        notify(AppConstants.SUCCESS, `Changes to Role ${selectedProduct.roleId} discarded`)
        console.log("Discard clicked!");
    };

    const handleDeleteRole = async () => {
        // Implement the logic for deleting the role
        setDeleteLoading(true)
        const confirmed = window.confirm('Are you sure you want to delete this role?');
        if (confirmed) {
            try {
                const response = await deleteRole(selectedProduct.roleId);
                console.log("response on delete", response)
                if (response.status === 200) {
                    console.log("Role deleted successfully!");
                    setRolesLoading(true);
                    notify(AppConstants.SUCCESS, `Role ${selectedProduct.roleId} deleted`);
                } else {
                    console.log("Delete role failed.");
                    notify(AppConstants.ERROR, response.message);
                }
            } catch (error) {
                console.error("Error deleting role:", error);
                notify(AppConstants.ERROR, "Error deleting role");
            } finally {
                setDeleteLoading(false)
            }
        }
    };

    return (
        <Box {...attributes}>
            <form
                style={{
                    padding: '14px 16px',
                    overflowY: 'auto',
                    overflowX: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Operations Section */}
                {selectedProduct?.operations?.length > 0 && (
                    <>
                        <Box
                            sx={{
                                position: 'sticky',
                                top: 0,
                                backgroundColor: 'white',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant="h6">Operations - {selectedProduct.roleId}</Typography>
                            {userManagementPermissions.delete && (
                                <Stack direction="row" spacing={1}>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={handleDeleteRole}
                                        disabled={deleteLoading}
                                    >
                                        {deleteLoading ? (
                                            <CircularProgress size={24} color='inherit' />
                                        ) : (
                                            'Delete Role'
                                        )}
                                    </Button>
                                </Stack>
                            )}
                        </Box>
                        <Divider sx={{ marginTop: '4px' }} />
                    </>
                )}

                {/* Switch Buttons Section */}
                {selectedProduct?.operations?.map((operation) => (
                    <Stack
                        key={operation.operationDesc}
                        direction="column"
                        sx={{
                            backgroundColor: '#f2f2f2',
                            cursor: 'pointer',
                            p: isXs || isSm ? '10px' : '10px',
                            marginBottom: '10px',
                            borderRadius: '8px',
                            overflowX: 'auto',
                        }}
                    >
                        <Typography variant="subtitle2">{operation.operationDesc}</Typography>
                        <Divider />
                        <Stack
                            direction={(isXs || isSm) ? 'column' : 'row'}
                            spacing={isXs ? 2 : 1}
                            alignItems="center"
                            sx={{ display: 'flex', marginTop: '7px', flexWrap: (isSm || isXs) && 'wrap' }}
                        >
                            {['create', 'read', 'update', 'delete'].map((property) => (
                                <Box
                                    key={property}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        border: '1px solid',
                                        borderColor: AppTheme.primary,
                                        padding: '5px',
                                        borderRadius: '5px',
                                        height: '40px',
                                        width: isXs ? '43%' : isSm ? '48%' : buttonWidth,
                                        marginBottom: isSm && '8px',  
                                    }}
                                >
                                    <Typography variant="body2">
                                        {property.charAt(0).toUpperCase() + property.slice(1)}
                                    </Typography>
                                    <Switch
                                        checked={
                                            modifiedSwitches[operation.operationDesc]?.[property] !== undefined
                                                ? modifiedSwitches[operation.operationDesc][property]
                                                : operation[property]
                                        }
                                        onChange={() => handleSwitchChange(operation.operationDesc, property)}
                                        disabled={!userManagementPermissions.update}
                                    />
                                </Box>
                            ))}
                        </Stack>
                    </Stack>
                ))}
                {/* Save and Discard Buttons Section */}
                {selectedProduct?.operations?.length > 0 && (
                    <>
                        <Box
                            sx={{
                                position: 'fixed',
                                bottom: 8,
                                paddingTop: 1,
                                paddingBottom: 1,
                                paddingLeft: 1,
                                right: 20,
                                paddingRight: 1,
                                backgroundColor: 'white',
                            }}
                        >
                            <Stack direction="row" spacing={2} justifyContent='flex-end'>
                                <Button variant="contained" color="primary" onClick={handleSave} disabled={saveLoading}>
                                    {saveLoading ? (
                                        <CircularProgress size={24} color='inherit' />
                                    ) : (
                                        'Save'
                                    )}
                                </Button>
                                <Button variant="contained" color="inherit" onClick={handleDiscard}>
                                    Discard
                                </Button>
                            </Stack>
                        </Box>
                    </>
                )}
            </form>
        </Box>
    );
};