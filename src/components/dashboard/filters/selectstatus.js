import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Stack } from '@mui/material';
import { AppConstants } from '../../../config/app-config';
import { AppContext } from '../../../context/app-context';
import { notify } from '../../../utils';
import useBreakpoints from '../../useBreakPoints';

export default function SelectStatus() {
  const { status, setStatus } = useContext(AppContext);
  const [statusOptions, setStatusOptions] = useState([]);
  const { isXs, isSm, isMd, isLg, isXl } = useBreakpoints();

  const getWidth = () => {
    // if (isXs) return '160px';
    if (isSm) return '160px';
    // if (isMd) return '170px';
    // if (isLg) return '180px';
    // if (isXl) return '200px';
    return '200px'; // default width
  };

  // Adding "All" option to the dropdown
  const allOption = (
    <MenuItem key="ALL" value="ALL">
      ALL
    </MenuItem>
  );

  const idOptions = [
    <MenuItem key="ALL" value="ALL">
      ALL
    </MenuItem>,
    ...(statusOptions ? (
      statusOptions.map(option => (
        <MenuItem key={option.id} value={option.id}>
          {option.dispId}
        </MenuItem>
      ))
    ) : []),
  ];

  return (
    <Stack style={{ alignItems: 'center' }}>
      <FormControl sx={{ mt: 1, width: '200px' }}>
        <InputLabel id="demo-simple-select-helper-label">Status</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={status}
          label="Status"
          onChange={(e) => setStatus(e.target.value)}
          sx={{ height: '40px' }}
        >
          {idOptions}
        </Select>
      </FormControl>
    </Stack>
  );
}
