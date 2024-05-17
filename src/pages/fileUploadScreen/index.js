import React, { useContext, useState } from 'react'
import { Stack, Typography } from '@mui/material';
import { checkRoleAccess } from '../../utils';
import AccessDenied from '../../components/accessDenied';
import FileUpload from '../../components/fileUpload';
import ResponsiveAppBar from '../../components/appBar';
import { ShipmentManagementContext } from '../../context/ShipmentManagementContext';
import LinearProgressSkeleton from '../../components/loadingScreens';

const FileUploadScreen = () => {
  const userPermissions = checkRoleAccess("FILE UPLOAD");
  const [submitFileLoading, setSubmitFileLoading] = useState(false);
  const { fileUploadLoading } = useContext(ShipmentManagementContext);

  if (!userPermissions.create) {
    return <AccessDenied />
  }
  return (
    <Stack direction="column" sx={{ position: 'relative', width: "100%", alignItems: "center", overflowX: 'hidden', overflowY: 'auto', rowGap: '4px' }}>
      {(fileUploadLoading || submitFileLoading) && <LinearProgressSkeleton />}
      <ResponsiveAppBar title='File Upload' />
      <FileUpload submitFileLoading={submitFileLoading} setSubmitFileLoading={setSubmitFileLoading} />
    </Stack>
  )
}

export default FileUploadScreen;
