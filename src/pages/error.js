import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom'; // If you want to link to another page

const ErrorPage = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
    }}
  >
    <Typography variant="h2" color="info" gutterBottom>
      Error 404
    </Typography>
    <Typography variant="h5" color="text.secondary" gutterBottom>
      Oops! The page you are looking for was not found.
    </Typography>
    <Button component={Link} to="/" variant="text" color="primary">
      Go to Home
    </Button>
  </Box>
);

export default ErrorPage;
