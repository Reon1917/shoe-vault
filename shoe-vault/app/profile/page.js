'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Grid,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';

export default function Profile() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [stats, setStats] = useState({
    totalShoes: 0,
    collections: 0,
    favorites: 0
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    setFormData(prev => ({
      ...prev,
      name: session.user.name || '',
      email: session.user.email || ''
    }));

    // Fetch user stats
    fetchUserStats();
  }, [session]);

  const fetchUserStats = async () => {
    try {
      const res = await fetch('/api/user/stats');
      const data = await res.json();
      if (res.ok) {
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', message: 'Profile updated successfully' });
        await update({ ...session, user: { ...session.user, name: formData.name } });
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Profile Summary Card */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              src={session.user.image}
              alt={session.user.name}
              sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
            />
            <Typography variant="h5" gutterBottom>
              {session.user.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {session.user.email}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            {/* Stats */}
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="h6">{stats.totalShoes}</Typography>
                <Typography variant="body2" color="textSecondary">Shoes</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h6">{stats.collections}</Typography>
                <Typography variant="body2" color="textSecondary">Collections</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h6">{stats.favorites}</Typography>
                <Typography variant="body2" color="textSecondary">Favorites</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Profile Edit Form */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Edit Profile
            </Typography>

            {status.message && (
              <Alert severity={status.type} sx={{ mb: 2 }}>
                {status.message}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={formData.email}
                    disabled
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Change Password
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Save Changes'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
