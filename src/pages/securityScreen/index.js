import React, { useContext } from 'react';
import { Stack } from '@mui/material';
import { checkRoleAccess } from '../../utils';
import AccessDenied from '../../components/accessDenied';
import LinearProgressSkeleton from '../../components/loadingScreens';
import ResponsiveAppBar from '../../components/appBar';
import { ShipmentManagementContext } from '../../context/ShipmentManagementContext';
import SecurityScreenTable from '../../components/securityScreen/table';

const SecurityScreen = () => {
  const userPermissions = checkRoleAccess("SECURITY");
  const { isContainersLoading, requestLoading } = useContext(ShipmentManagementContext);

  if (!userPermissions.read) {
    return <AccessDenied />
  }

  return (
    <Stack direction="column" sx={{ position: 'relative', width: "100%", alignItems: "center", overflowX: 'hidden', overflowY: 'auto', rowGap: '4px' }}>
      {(isContainersLoading || requestLoading) && <LinearProgressSkeleton />}
      <ResponsiveAppBar title='Security' />
      <SecurityScreenTable />
    </Stack>
  );
}

export default SecurityScreen;
