import React, { useContext, useState } from 'react';
import { Stack } from '@mui/material';
import ResponsiveAppBar from '../../components/appBar';
import LinearProgressSkeleton from '../../components/loadingScreens';
import LovInfo from '../../components/lov/table';
import { LovContext } from '../../context/LovContext';
import { checkRoleAccess } from '../../utils';
import AccessDenied from '../../components/accessDenied';

const LOV = () => {
  const { lovLoading, requestLoading } = useContext(LovContext);

  const userPermissions = checkRoleAccess("USER MANAGEMENT");

  if (!userPermissions.read) {
    return <AccessDenied />
  }

  return (
    <Stack direction="column" sx={{ position: 'relative', width: "100%", alignItems: "center", overflowX: 'hidden', overflowY: 'auto', rowGap: '4px' }}>
      {(lovLoading || requestLoading) && <LinearProgressSkeleton />}
      <ResponsiveAppBar title='LOV' />
      <LovInfo />
    </Stack>
  );
}

export default LOV;
