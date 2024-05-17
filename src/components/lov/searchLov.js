import React, { useState, useEffect, useContext } from 'react';
import TextField from '@mui/material/TextField';
import { Autocomplete, Box, FormControl, IconButton, InputAdornment, Tooltip } from '@mui/material';

import { lovEntityTypes } from './utils';
import { LovContext } from '../../context/LovContext';
import { notify } from '../../utils/index';
import { AppConstants } from '../../config/app-config';
import { crudLov, lovEntityType } from '../../api/pod';
import { Search } from '@mui/icons-material';
import { ClearIcon } from '@mui/x-date-pickers';

const SearchLov = ({ setAddingNewRow, setSelectedRow, selectedLovEntityType, setSelectedLovEntityType }) => {
  const { lovLoading, setLovLoading, lovList, setLovList, requestLoading, setRequestLoading, setPage, lovSearchText, setLovSearchText } = useContext(LovContext);

  const loadLov = async () => {
    try {
      const response = await lovEntityType(selectedLovEntityType.name);
      setLovList(response.entities);
    } catch (e) {
      notify(AppConstants.ERROR, "Couldn't fetch LOV info");
    } finally {
      if (lovLoading) {
        setLovLoading(false);
      }
      if (requestLoading) {
        setRequestLoading(false);
      }
    }
  }

  useEffect(() => {
    (async () => {
      await loadLov();
    })();
  }, [lovLoading]);

  useEffect(() => {
    if (selectedLovEntityType) {
      setLovLoading(true);
      setPage(0);
      setLovSearchText('');
    }
  }, [selectedLovEntityType])

  return (
    <div style={{ width: '100%', padding: 10, display: "flex", direction: "row", background: '' }}>
      <Autocomplete
        sx={{ width: '25ch', mr: '20px' }}
        value={selectedLovEntityType}
        onChange={(e, newValue) => setSelectedLovEntityType(newValue)}
        options={lovEntityTypes}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => <TextField {...params} variant="outlined" size='small' />}
      />
      <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
        <TextField
          id="search-bar"
          label="Search by Entity ID"
          variant="outlined"
          size="small"
          style={{ width: '25ch' }}
          InputLabelProps={{
            style: { fontSize: '0.8rem' },
          }}
          InputProps={{
            endAdornment: (
              lovSearchText && <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setLovSearchText('')}>
                  <ClearIcon fontSize='small' />
                </IconButton>
              </InputAdornment>
            ),
          }}
          value={lovSearchText}
          onChange={(e) => setLovSearchText(e.target.value)}
        />
        {/* <Tooltip title="Search" size='small'>
          <IconButton type="submit">
            <Search />
          </IconButton>
        </Tooltip> */}
      </Box>
    </div>
  );
};

export default SearchLov;
