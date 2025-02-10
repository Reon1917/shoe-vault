'use client';

import { Box, Container } from '@mui/material';
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar />
      <Container 
        component="main" 
        maxWidth="xl" 
        sx={{ 
          flex: 1,
          py: 4,
          px: { xs: 2, sm: 3, md: 4 },
          '& > *': {
            animation: 'fadeIn 0.5s ease-out forwards',
          },
        }}
      >
        {children}
      </Container>
    </Box>
  );
}
