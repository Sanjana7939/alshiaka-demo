import React, { useState } from 'react';
import TextField from '@mui/material/TextField';


const SearchUser = ({ onSearch, setPage }) => {
    const [searchText, setSearchText] = useState('');
    const handleChange = (e) => {
        setSearchText(e.target.value);
        onSearch(e.target.value);
        setPage(0);
    };

    return (
        <>
        <TextField
          id="search-bar"
          label="Search User Email"
          variant="outlined"
          size="small"
          margin="normal"
          value={searchText}
          onChange={handleChange}
          style={{ width: '180px' }}
        />
      </>
    );
};

export default SearchUser;
