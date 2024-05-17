import React, { useContext } from 'react';
import { Stack } from '@mui/material';
import LogisticsScreenTable from '../../components/logisticsScreen/table';
import { checkRoleAccess } from '../../utils';
import AccessDenied from '../../components/accessDenied';
import { ShipmentManagementContext } from '../../context/ShipmentManagementContext';
import LinearProgressSkeleton from '../../components/loadingScreens';
import ResponsiveAppBar from '../../components/appBar';

const LogisticsScreen = () => {
  const userPermissions = checkRoleAccess("LOGISTICS");
  const { isContainersLoading, requestLoading } = useContext(ShipmentManagementContext);

  if (!userPermissions.read) {
    return <AccessDenied />
  }

  return (
    <Stack direction="column" sx={{ position: 'relative', width: "100%", alignItems: "center", overflowX: 'hidden', overflowY: 'auto', rowGap: '4px' }}>
      {(isContainersLoading || requestLoading) && <LinearProgressSkeleton />}
      <ResponsiveAppBar title='Logistics' />
      <LogisticsScreenTable />
    </Stack>
  );
}

export default LogisticsScreen;

