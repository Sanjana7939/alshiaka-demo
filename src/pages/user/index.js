import React, { useContext, useState } from 'react';
import { Stack, Typography, CircularProgress } from '@mui/material';
import UsersInfo from '../../components/user/table';
import ResponsiveAppBar from '../../components/appBar';
import LinearProgressSkeleton from '../../components/loadingScreens';
import { UserManagementContext } from '../../context/UserManagementContext';
import AccessDenied from '../../components/accessDenied';
import { checkRoleAccess } from '../../utils';

const Index = () => {
  const userPermissions = checkRoleAccess("USER MANAGEMENT");
  const { usersLoading, requestLoading } = useContext(UserManagementContext);

  if (!userPermissions.read) {
    return <AccessDenied />
  }

  return (
    <Stack direction="column" sx={{ position: 'relative', width: "100%", alignItems: "center", overflowX: 'hidden', overflowY: 'auto', rowGap: '4px' }}>
      {(usersLoading || requestLoading) && <LinearProgressSkeleton />}
      <ResponsiveAppBar title='Users' />
      <UsersInfo/>
    </Stack>
  );
}

export default Index;
