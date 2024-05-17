import React, { useContext } from 'react';
import { Stack } from '@mui/material';
import DataScreenTable from '../../components/dataScreen/table';
import { checkRoleAccess } from '../../utils';
import AccessDenied from '../../components/accessDenied';
import { ShipmentManagementContext } from '../../context/ShipmentManagementContext';
import LinearProgressSkeleton from '../../components/loadingScreens';
import ResponsiveAppBar from '../../components/appBar';

const DataScreen = () => {
  const userPermissions = checkRoleAccess("LOGISTICS");
  const { isContainersLoading, requestLoading } = useContext(ShipmentManagementContext);

  if (!userPermissions.read) {
    return <AccessDenied />
  }

  return (
    <Stack direction="column" sx={{ position: 'relative', width: "100%", alignItems: "center", overflowX: 'hidden', overflowY: 'auto', rowGap: '4px' }}>
      {(isContainersLoading || requestLoading) && <LinearProgressSkeleton />}
      <ResponsiveAppBar title='Data' />
      <DataScreenTable />
    </Stack>
  );
}

export default DataScreen;

