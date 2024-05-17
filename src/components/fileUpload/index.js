import * as React from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Grow, Paper, Popper, MenuItem, Box, Stack, styled, Button, ButtonGroup, Typography, CircularProgress, MenuList, ClickAwayListener, TextField, Select, FormControl, InputLabel, Autocomplete } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { fileUpload, fileUploadLov } from '../../api/shipmentManagement';
import DownloadIcon from '@mui/icons-material/Download';
import { useEffect, useState, useRef, useContext } from 'react';
import { AppConstants, notify } from '../../config/app-config';
import { compareHeaders, parseCsvHeaders, parseCsvRows, readFileAsText } from './utils';
import useBreakpoints from '../useBreakPoints';
import fileUploadSVG from '../../assets/images/fileUploadSVG.svg'
import { Auth } from 'aws-amplify';
import Papa from 'papaparse';
import { AppContext } from '../../context/app-context';
import { ShipmentManagementContext } from '../../context/ShipmentManagementContext';
import { fileTypeData } from './utils';
import LinearProgressSkeleton from '../loadingScreens';
import DialogBox from './dilogBox';
import { lovEntityType } from '../../api/pod';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const FileUpload = ({ submitFileLoading, setSubmitFileLoading }) => {
    const anchorRef = useRef(null);
    const breakpoints = useBreakpoints();
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState('');
    const [pageState, setPageState] = useState({
        selectedIndex: -1,
        hasError: false,
        fileUploadDisabled: true,
        dropdownOptions: [],
        dropdownMenuOpen: false,
        acceptedFileData: null,
        facility: null,
    })
    const [selectedFileTypeHeaders, setSelectedFileTypeHeaders] = useState([]);
    const { isXs, isSm, isMd, isLg, isXl, isSidebarCollapseBreakPoint } = useBreakpoints();
    const { facilityList, setFacilityList, fileUploadLoading, setFileUploadLoading } = useContext(ShipmentManagementContext);

    // dialog box states
    const [dialogOpen, setDialogOpen] = useState(false);
    const [unprocessedContainers, setUnprocessedContainers] = useState(false);

    useEffect(() => {
        if (facilityList.length === 1) {
            setPageState({ ...pageState, facility: facilityList[0] })
        }
    }, [facilityList]);

    useEffect(() => {
        (async () => {
            try {
                // if (fileUploadLoading) {
                    const response = await fileUploadLov('FLTYPES');
                    setPageState({
                        ...pageState,
                        dropdownOptions: response.data
                    })

                    if (!facilityList || facilityList.length === 0) {
                        const lovResponse = await lovEntityType('WH');
                        setFacilityList(lovResponse.entities)
                    }
                // }
            } catch (e) {
                notify(AppConstants.ERROR, e);
            } finally {
                setFileUploadLoading(false);
            }
        })()
    }, [fileUploadLoading]);

    const handleDialogClose = (forceSubmit) => {
        setDialogOpen(false);
        setUnprocessedContainers([]);
        if (forceSubmit) {
            handleSubmit(true);
        }
    }

    const handleMenuItemClick = (event, index) => {
        const selectedFileType = pageState.dropdownOptions[index];
        console.log("new", pageState.dropdownOptions[index])
        setPageState({
            ...pageState,
            selectedIndex: index,
            fileUploadDisabled: false,
            dropdownMenuOpen: false,
            acceptedFileData: null
        })
        setSelectedFileTypeHeaders(selectedFileType.headers || []);
    };

    const handleToggle = () => {
        setPageState({
            ...pageState,
            dropdownMenuOpen: true
        })
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setPageState({
            ...pageState,
            dropdownMenuOpen: false
        });
    };


    const handleFileChange = async (event) => {
        const fileInput = event.target;
        const selectedFile = fileInput.files[0];
        setUploadedFileName(selectedFile.name)

        setPageState({
            ...pageState,
            fileUploadDisabled: true,
            uploadSuccess: null,
        })

        if (!selectedFile) {
            return;
        }

        setUploadLoading(true);
        const allowedExtensions = ['.csv'];
        const fileName = selectedFile.name;
        const fileExtension = fileName.split('.').pop().toLowerCase();
        console.log('Selected file:', fileName);
        console.log('File extension:', fileExtension);

        const { username } = await Auth.currentUserInfo();

        if (!allowedExtensions.includes(fileExtension) && !fileName.toLowerCase().includes('.csv')) {
            setUploadLoading(false);
            notify(AppConstants.ERROR, 'File upload failed. Please select a valid CSV file.');
        }

        try {
            const fileContent = await readFileAsText(selectedFile);
            console.log("FILE CONTENT =========> ", fileContent);
            const fileHeaders = parseCsvHeaders(fileContent);
            console.log("FILE HEADERS ========>", fileHeaders)

            const selectedFileType = pageState.dropdownOptions[pageState.selectedIndex];

            if (!selectedFileType || !selectedFileType.headers) {
                return;
            }

            // header comparison logic start
            const fileTypeHeaders = selectedFileType.headers;
            if (!compareHeaders(fileHeaders, fileTypeHeaders, pageState)) {
                setPageState({
                    ...pageState,
                    fileUploadDisabled: true,
                    uploadSuccess: false,
                    uploadMessage: null,
                    acceptedFileData: null
                })
                notify(AppConstants.ERROR, "File can't be accepted. Please check format")
                fileInput.value = '';
                return;
            }
            // header comparison logic end

            const fileRows = await parseCsvRows(selectedFile, pageState.dropdownOptions[pageState.selectedIndex]);
            const data = {
                file_name: fileName,
                file_type: pageState.dropdownOptions[pageState.selectedIndex].id, // Assuming the fileType is taken from the selected dropdown option
                user_id: username,
                rows: fileRows,
            };
            console.log('FILEUPLOAD DATA =========>:', data);

            console.log('File uploaded:', selectedFile);
            // notify(AppConstants.SUCCESS, "File '" + fileName + "'  has been Accepted successfully")
            setPageState({
                ...pageState,
                fileUploadDisabled: false,
                uploadSuccess: true,
                acceptedFileData: data,
            })
        } catch (error) {
            console.error('Error reading file content:', error);
            notify(AppConstants.ERROR, error)
        }
        finally {
            // Reset uploadLoading state after processing the file
            setUploadLoading(false);
        }
        fileInput.value = '';
    };

    const getFilteredContainersData = (unprocessed_containers) => {
        let data = { ...pageState.acceptedFileData };
        let filteredContainers = [];
        if (data.file_type === 'FCL') {
            filteredContainers = data.rows.filter((row) => {
                return unprocessed_containers.some(obj => obj['container_id'] === row.container_no);
            }) 
        } else {
            filteredContainers = data.rows.filter((row) => {
                return unprocessed_containers.some(obj => obj['container_id'] === row.boe);
            })
        }
        data.rows = filteredContainers;
        return data;
    }

    const handleSubmit = async (force) => {
        console.log('File submit Btn Clicked');
        try {
            if (!pageState.facility) {
                throw "Warehouse Id is required"
            }
            setSubmitFileLoading(true)
            const data = { ...pageState.acceptedFileData, facility_id: pageState.facility.entityID }
            console.log('submit data=====', data)
            const response = await fileUpload(data, force);;

            if (response.data.unprocessed_containers.length > 0) {
                notify(AppConstants.WARNING, response.message)
                setUnprocessedContainers(response.data.unprocessed_containers)
                setDialogOpen(true);

                setPageState((prev) => {
                    return { ...prev, acceptedFileData: getFilteredContainersData(response.data.unprocessed_containers)}
                });
            } else {
                notify(AppConstants.SUCCESS, response.message)
                setPageState({
                    ...pageState,
                    acceptedFileData: null,
                    selectedIndex: -1,
                    facility: null
                });
                setUnprocessedContainers([])
                setUploadedFileName('')
                const fileInput = document.querySelector('input[type="file"]');
                if (fileInput) {
                    fileInput.value = '';
                }
            }

        } catch (error) {
            notify(AppConstants.ERROR, error)
        }
        finally {
            setSubmitFileLoading(false)
        }
    };

    const downloadTemplate = () => {
        if (selectedFileTypeHeaders.length === 0 || pageState.selectedIndex === -1) {
            return;
        }

        const selectedFileType = pageState.dropdownOptions[pageState.selectedIndex];
        const csvData = [selectedFileTypeHeaders]; // Add headers as the first row
        const csvString = Papa.unparse(csvData);

        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');

        // Set the file name based on the selected item in the dropdown
        const fileName = `${selectedFileType.id}_template.csv`;
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    };

    const defaultProps = {
        options: facilityList,
        getOptionLabel: (option) => option.entityDesc,
      };

    return (
        <Stack
            direction="column"
            sx={{
                position: 'relative',
                // height: '450px',
                height: '100%',
                // width: breakpoints.isSmallScreen ? '90%' : '40%',
                width: '100%',
                backgroundColor: '#ffffff',
                // margin: 'auto',
            }}
        >

            <DialogBox open={dialogOpen} handleClose={handleDialogClose} unprocessedContainers={unprocessedContainers} />

            <Stack
                direction="column"
                spacing={2}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: breakpoints.isSmallScreen ? '10%' : '20px',
                }}
            >
                <img src={fileUploadSVG} alt="fileUploadSVG" style={{ maxWidth: '100%', height: '190px' }} />
                <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
                    <Button
                        onClick={handleToggle}
                        style={{
                            width: breakpoints.isSmallScreen ? '80px' : '140px',
                            backgroundColor: '#1976D2',
                            color: 'white',
                            alignItems: 'center',
                            textTransform: 'none',
                            height: '40px',
                        }}
                    >
                        {pageState.selectedIndex === -1 ? 'Select File Type' : pageState.dropdownOptions[pageState.selectedIndex].id}
                    </Button>
                    <Button
                        size="small"
                        aria-controls={pageState.dropdownMenuOpen ? 'split-button-menu' : undefined}
                        aria-expanded={pageState.dropdownMenuOpen ? 'true' : undefined}
                        aria-label="select merge strategy"
                        aria-haspopup="menu"
                        onClick={handleToggle}
                        style={{
                            color: 'white',
                            backgroundColor: '#1976D2',
                            width: breakpoints.isSmallScreen ? '20px' : '40px',
                        }}
                    >
                        <ArrowDropDownIcon />
                    </Button>
                </ButtonGroup>
                <Popper
                    sx={{
                        zIndex: 1,
                    }}
                    open={pageState.dropdownMenuOpen}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    transition
                    disablePortal
                >
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{
                                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                            }}
                        >
                            <Paper
                                sx={{
                                    backgroundColor: 'white',
                                    color: 'black',
                                    width: breakpoints.isSmallScreen ? '80px' : '180px',
                                    marginTop: '2px',
                                }}
                            >
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList id="split-button-menu" autoFocusItem>
                                        {pageState.dropdownOptions.map((option, index) => (
                                            <MenuItem
                                                key={option.id}
                                                selected={index === pageState.selectedIndex}
                                                onClick={(event) => handleMenuItemClick(event, index)}
                                            >
                                                {option.id}
                                            </MenuItem>
                                        ))}
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
                <Button
                    component="label"
                    variant="contained"
                    onClick={downloadTemplate}
                    // startIcon={<DownloadIcon />}
                    disabled={pageState.selectedIndex === -1}
                    sx={{
                        textTransform: 'none',
                        marginLeft: '5px',
                        width: breakpoints.isSmallScreen ? '100px' : '180px',
                    }}
                >
                    Download Template
                </Button>
                <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    disabled={pageState.selectedIndex === -1}
                    sx={{ textTransform: 'none', width: breakpoints.isSmallScreen ? '100%' : '180px' }}
                >
                    {uploadLoading ? (
                        <CircularProgress size={20} style={{ marginRight: '10px', color: '#fff' }} />
                    ) : (
                        'Browse File'
                    )}
                    <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                </Button>

                {uploadedFileName && (
                    <Typography
                        variant="body2"
                        sx={{
                            alignItems: 'center',
                            marginTop: breakpoints.isSmallScreen ? '10px' : '0px',
                            color: '#1976D2',
                            flexShrink: 0,
                        }}
                    >
                        {uploadedFileName}
                    </Typography>
                )}
                <Stack sx={{ alignItems: 'center' }}>
                    <Autocomplete
                        sx={{ width: breakpoints.isSmallScreen ? '100px' : '180px' }}
                        value={pageState.facility || null}
                        onChange={(event, newValue) => setPageState({ ...pageState, facility: newValue })}
                        options={facilityList}
                        getOptionLabel={(option) => option.entityDesc}
                        renderInput={(params) => <TextField {...params} variant="standard" size='small' label='Warehouse' />}
                    />
                    <Button
                        variant="contained"
                        onClick={() => handleSubmit(false)}
                        disabled={pageState.acceptedFileData == null}
                        sx={{ textTransform: 'none', marginTop: '10px', width: breakpoints.isSmallScreen ? '100px' : '180px' }}
                    >
                        Submit
                    </Button>

                </Stack>
            </Stack>
        </Stack>
    );
};

export default FileUpload;