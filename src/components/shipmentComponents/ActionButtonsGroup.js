import { useContext } from 'react';
import { Button, Paper } from '@mui/material';
import { ShipmentManagementContext } from '../../context/ShipmentManagementContext';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import DensitySmallIcon from '@mui/icons-material/DensitySmall';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExportDataMenu from '../exportDataMenu';

export default function ActionButtonsGroup({ isTableDense, setIsTableDense }) {
    const { clearShipmentManagementContext, containersList, displayName, displayAttribute, statusAttributes } = useContext(ShipmentManagementContext);

    return (
        <Paper square sx={{ width: '100%', p: 1 }}>
            <Button variant="text" startIcon={<RefreshIcon />} size='small' onClick={() => clearShipmentManagementContext()}>
                Refresh
            </Button>
            <Button variant="text" startIcon={isTableDense ? <DensitySmallIcon /> : <DensityMediumIcon />} onClick={() => setIsTableDense(!isTableDense)} size='small'>
                Density
            </Button>
        </Paper>
    );
}
