'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Collections,
  AccountCircle,
  Settings,
  Favorite,
  Search,
} from '@mui/icons-material';
import Link from 'next/link';

export default function DashboardLayout({ children, stats }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, href: '/dashboard' },
    { text: 'Collections', icon: <Collections />, href: '/collections' },
    { text: 'Wishlist', icon: <Favorite />, href: '/wishlist' },
    { text: 'Search', icon: <Search />, href: '/search' },
    { text: 'Profile', icon: <AccountCircle />, href: '/profile' },
    { text: 'Settings', icon: <Settings />, href: '/settings' },
  ];

  const drawer = (
    <Box>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <img src="/logo.png" alt="Shoe Vault" style={{ width: 40, height: 40 }} />
        <Typography variant="h6" noWrap component="div">
          Shoe Vault
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <Link href={item.href} key={item.text} style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItem button>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar for desktop */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(180deg, #1a237e 0%, #0d47a1 100%)'
              : 'linear-gradient(180deg, #e3f2fd 0%, #bbdefb 100%)',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${240}px)` },
          ml: { sm: `${240}px` },
        }}
      >
        {/* Mobile menu button */}
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Stats cards */}
        {stats && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {Object.entries(stats).map(([key, value]) => (
              <Grid item xs={12} sm={6} md={3} key={key}>
                <Card
                  sx={{
                    height: '100%',
                    background: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)'
                        : 'linear-gradient(45deg, #e3f2fd 30%, #bbdefb 90%)',
                  }}
                >
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Typography>
                    <Typography variant="h4" component="div">
                      {value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Main content */}
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>
    </Box>
  );
}
