'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from '@/lib/ThemeContext';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Tooltip,
  MenuItem,
  Button,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  AccountCircle,
  CollectionsBookmark,
  LocalMall,
  Settings,
  ExitToApp,
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { data: session, status } = useSession();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  // If session is loading, return a loading state
  if (status === 'loading') {
    return (
      <AppBar position="static" sx={{ bgcolor: 'background.paper' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Shoe Vault
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
    );
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSignOut = async () => {
    handleCloseUserMenu();
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderBottom: '1px solid',
        borderColor: theme === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo - Desktop */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
            }}
          >
            SHOE VAULT
          </Typography>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem onClick={handleCloseNavMenu} component={Link} href="/vault">
                <LocalMall sx={{ mr: 1 }} /> My Vault
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu} component={Link} href="/collections">
                <CollectionsBookmark sx={{ mr: 1 }} /> Collections
              </MenuItem>
            </Menu>
          </Box>

          {/* Logo - Mobile */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/"
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
            }}
          >
            SHOE VAULT
          </Typography>

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              component={Link}
              href="/vault"
              onClick={handleCloseNavMenu}
              sx={{ my: 2, display: 'flex', alignItems: 'center' }}
            >
              <LocalMall sx={{ mr: 1 }} /> My Vault
            </Button>
            <Button
              component={Link}
              href="/collections"
              onClick={handleCloseNavMenu}
              sx={{ my: 2, display: 'flex', alignItems: 'center' }}
            >
              <CollectionsBookmark sx={{ mr: 1 }} /> Collections
            </Button>
          </Box>

          {/* Theme Toggle */}
          <IconButton onClick={toggleTheme} sx={{ mr: 2 }}>
            {theme === 'dark' ? <LightIcon /> : <DarkIcon />}
          </IconButton>

          {/* User Menu */}
          {session ? (
            <Box sx={{ flexShrink: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={session.user.name}
                    src={session.user.image}
                    sx={{
                      bgcolor: 'primary.main',
                      width: 40,
                      height: 40,
                    }}
                  >
                    {session.user.name?.[0]}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleCloseUserMenu} component={Link} href="/profile">
                  <AccountCircle sx={{ mr: 1 }} /> Profile
                </MenuItem>
                <MenuItem onClick={handleCloseUserMenu} component={Link} href="/settings">
                  <Settings sx={{ mr: 1 }} /> Settings
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleSignOut}>
                  <ExitToApp sx={{ mr: 1 }} /> Sign Out
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                component={Link}
                href="/auth/signin"
                variant="outlined"
                sx={{
                  borderRadius: '20px',
                  px: 2,
                }}
              >
                Sign In
              </Button>
              <Button
                component={Link}
                href="/auth/signup"
                variant="contained"
                sx={{
                  borderRadius: '20px',
                  px: 2,
                }}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}