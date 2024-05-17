import React, { useContext } from 'react';
import { Stack } from '@mui/material';
import DataScreenTable from '../../components/dataScreen/table';
import { ShipmentManagementContext } from '../../context/ShipmentManagementContext';
import LinearProgressSkeleton from '../../components/loadingScreens';
import ResponsiveAppBar from '../../components/appBar';

const DataScreen = () => {
  const { isContainersLoading, requestLoading } = useContext(ShipmentManagementContext);

  return (
    <Stack direction="column" sx={{ position: 'relative', width: "100%", alignItems: "center", overflowX: 'hidden', overflowY: 'auto', rowGap: '4px' }}>
      {(isContainersLoading || requestLoading) && <LinearProgressSkeleton />}
      <ResponsiveAppBar title='Data' />
      <DataScreenTable />
    </Stack>
  );
}

export default DataScreen;

