import React, { useContext, useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Stack } from '@mui/material';
import { AppContext } from '../../../context/app-context';
import useBreakpoints from '../../useBreakPoints';

export default function SelectCategory() {
  const { category, setCategory } = useContext(AppContext);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const { isXs, isSm, isMd, isLg, isXl } = useBreakpoints();

  const getWidth = () => {
    // if (isXs) return '160px';
    if (isSm) return '160px';
    // if (isMd) return '170px';
    // if (isLg) return '180px';
    // if (isXl) return '200px';
    return '200px'; // default width
  };


  // Adding "ALL" option to the dropdown
  const idOptions = [
    <MenuItem key="ALL" value="ALL">
      ALL
    </MenuItem>,
    ...(dropdownOptions ? (
      dropdownOptions.map(option => (
        <MenuItem key={option.id} value={option.id}>
          {option.id}
        </MenuItem>
      ))
    ) : []),
  ];

  return (
    <Stack style={{ alignItems: 'center' }}>
      <FormControl sx={{ mt: 1, width: '200px' }}>
        <InputLabel>Type</InputLabel>
        <Select
          value={category}
          label="Category"
          onChange={(e) => setCategory(e.target.value)}
          sx={{ height: '40px' }}
        >
          {idOptions}
        </Select>
      </FormControl>
    </Stack>
  );
}
