import React, { useContext } from 'react';
import { Stack, Typography, CircularProgress } from '@mui/material';
import PlanningScreenTable from '../../components/planningScreen/table';
import { checkRoleAccess } from '../../utils';
import AccessDenied from '../../components/accessDenied';
import LinearProgressSkeleton from '../../components/loadingScreens';
import ResponsiveAppBar from '../../components/appBar';
import { ShipmentManagementContext } from '../../context/ShipmentManagementContext';

const PlanningScreen = () => {
  const userPermissions = checkRoleAccess("PLANNING");
  const { isContainersLoading, requestLoading } = useContext(ShipmentManagementContext);

  if (!userPermissions.read) {
    return <AccessDenied />
  }

  return (
    <Stack direction="column" sx={{ position: 'relative', width: "100%", alignItems: "center", overflowX: 'hidden', overflowY: 'auto', rowGap: '4px' }}>
      {(isContainersLoading || requestLoading) && <LinearProgressSkeleton />}
      <ResponsiveAppBar title='Planning' />
      <PlanningScreenTable />
    </Stack>
  );
}

export default PlanningScreen;
