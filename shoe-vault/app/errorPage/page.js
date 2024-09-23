import React from 'react';
import { Box, Typography, IconButton, createTheme, ThemeProvider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const ErrorPage = () => {
  const router = useRouter();

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
        <Typography variant="h4" color="error" textAlign="center">
          Sorry, the details for this shoe isn't available
        </Typography>
        <IconButton onClick={() => router.back()} color="primary" sx={{ mt: 2 }}>
          <ArrowBackIcon />
        </IconButton>
      </Box>
    </ThemeProvider>
  );
};

export default ErrorPage;