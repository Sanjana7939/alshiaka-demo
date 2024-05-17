import * as React from 'react';
import Box from '@mui/material/Box';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Button, CircularProgress,
} from '@mui/material';
import { Close, TroubleshootRounded } from '@mui/icons-material';
import { addRole } from '../../api';
import { AppContext } from '../../context/app-context';
import { Auth } from 'aws-amplify';
import { AppConstants } from '../../config/app-config';
import { notify } from '../../utils';

const DialogBox = ({ open, handleClose, onSave }) => {
  const { user, setRolesLoading } = React.useContext(AppContext)
  const [saveLoading, setSaveLoading] = React.useState(false)
  const [newRoleData, setNewRoleData] = React.useState({
    roleId: '',
    role: '00000',
    roleDesc: '',
    updatedBy: user,
    createdBy: user,
    isActive: true,
  });

  const handleInputChange = (field, value) => {
    setNewRoleData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    // Validate required fields
    if (!newRoleData.roleId || !newRoleData.role) {
      notify(AppConstants.ERROR, "Role ID and Role are required fields");
      return;
    }

    try {
      // Call the addRole API
      setSaveLoading(true)
      const { username } = await Auth.currentUserInfo();
      const data = { ...newRoleData, updatedBy: username, createdBy: username }
      const response = await addRole(data);

      if (response.status === 200) {
        console.log("Role added successfully!");
        setRolesLoading(true);
        handleClose();
      } else {
        console.log("Role addition failed.");
        notify(AppConstants.ERROR, response.message);
      }
    } catch (error) {
      console.error("Error adding role:", error);
      notify(AppConstants.ERROR, "Error adding role");
    }
    finally {
      setSaveLoading(false);
    }
  };

  const handleDiscard = () => {
    setNewRoleData([])
    handleClose();
  };

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle id="alert-dialog-title" sx={{ fontSize: 20 }}>Create New Role</DialogTitle>
      <Box position="absolute" top={0} right={0}>
        <IconButton onClick={() => handleClose()}>
          <Close />
        </IconButton>
      </Box>
      <DialogContent >
        <Box marginBottom={2}>
          <TextField
            label="Role ID"
            variant="outlined"
            margin="normal"
            value={newRoleData.roleId}
            onChange={(e) => handleInputChange('roleId', e.target.value)}
            fullWidth
          />
        </Box>
        <TextField
          label="Role Description"
          variant="outlined"
          margin="normal"
          value={newRoleData.roleDesc}
          onChange={(e) => handleInputChange('roleDesc', e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleDiscard}
          color="inherit"
          variant="contained"
          sx={{ color: 'black' }}
        >
          Discard
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          variant="contained"
          sx={{ color: 'white' }}
          disabled={saveLoading}
        >
          {saveLoading ? (
            <CircularProgress size={24} color='inherit' />
          ) : ('Save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogBox;

