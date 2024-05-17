import * as React from 'react';
import Box from '@mui/material/Box';
import {
    Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Button, CircularProgress, ListItemButton, ListItemText, List, ListItem, ListItemIcon, Table, TableHead, TableRow, TableCell, TableContainer, Paper, TableBody, Typography, DialogContentText,
} from '@mui/material';
import { Close } from '@mui/icons-material';

const DialogBox = ({ open, handleClose, unprocessedContainers }) => {
    const forceSubmitButtonName = 'Force Submit'
    return (
        <Dialog open={open} fullWidth>
            <DialogTitle id="alert-dialog-title" sx={{ fontSize: 20 }}>Unprocessed Containers</DialogTitle>
            <DialogContent style={{height: '100%', overflowY: 'hidden'}}>
            <DialogContentText style={{height: '100%'}}>
                    These containers already exists.
                </DialogContentText>
                <DialogContentText style={{height: '100%'}}>
                    Click on "{forceSubmitButtonName}" to overwrite data.
                </DialogContentText>
            </DialogContent>
            <Box position="absolute" top={0} right={0}>
                <IconButton onClick={() => handleClose(false)}>
                    <Close />
                </IconButton>
            </Box>
            <DialogContent >
                <Box marginBottom={2}>

                    {unprocessedContainers &&
                        <TableContainer component={Paper}>
                            <Table size='small'>
                                <TableHead>
                                    <TableRow style={{backgroundColor: '#eee',}}>
                                        <TableCell align="left">Container Id</TableCell>
                                        <TableCell align="left">DC Id</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {unprocessedContainers.map((row, i) => (
                                        <TableRow
                                            key={i}
                                            hover
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="left">{row.container_id}</TableCell>
                                            <TableCell align="left">{row.facility_id}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    }

                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => handleClose(false)}
                    color="inherit"
                    variant="contained"
                    sx={{ color: 'black' }}
                >
                    Discard
                </Button>
                <Button
                    onClick={() => handleClose(true)}
                    color="primary"
                    variant="contained"
                    sx={{ color: 'white' }}
                >
                    {forceSubmitButtonName}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogBox;