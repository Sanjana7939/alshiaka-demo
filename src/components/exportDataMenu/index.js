import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { downloadTableData } from '../../utils/shipmentManagement';
import CloudDoneIcon from '@mui/icons-material/CloudDone';

export default function ExportDataMenu({ SHIPMENT_TYPE, displayAttribute, displayName, statusAttributes, containersList, filteredData }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (type) => {
    setAnchorEl(null);
    if (type && type === 'FULL') {
      downloadTableData(SHIPMENT_TYPE, displayAttribute, displayName, statusAttributes, containersList)
    } else if (type && type === 'FILTERED') {
      downloadTableData(SHIPMENT_TYPE, displayAttribute, displayName, statusAttributes, filteredData)
    }
  };

  return (
    <>
      <Button
        variant="text"
        startIcon={<SaveAltIcon />}
        size='small'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Export
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose(null)}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => handleClose('FULL')}>
          <ListItemIcon>
            <CloudDoneIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Full Data</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleClose('FILTERED')}>
          <ListItemIcon>
            <FilterAltIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Filtered Data</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}