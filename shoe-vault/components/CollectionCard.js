'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Grid,
  Avatar,
  AvatarGroup,
  Tooltip,
  Fade,
  LinearProgress,
} from '@mui/material';
import {
  Edit,
  Delete,
  MoreVert,
  Visibility,
} from '@mui/icons-material';
import Link from 'next/link';

export default function CollectionCard({ collection, onEdit, onDelete, onView }) {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate collection stats
  const totalShoes = collection.shoes?.length || 0;
  const totalValue = collection.shoes?.reduce((sum, shoe) => sum + (shoe.retailPrice || 0), 0) || 0;

  return (
    <Card
      className="hover-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        background: (theme) => 
          theme.palette.mode === 'dark' 
            ? 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)'
            : 'linear-gradient(45deg, #e3f2fd 30%, #bbdefb 90%)',
      }}
    >
      <CardContent sx={{ flexGrow: 1, position: 'relative' }}>
        {/* Collection Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h5" component="div" gutterBottom fontWeight="bold">
              {collection.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {collection.description || 'No description'}
            </Typography>
          </Box>

          <Fade in={isHovered}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="View">
                <IconButton
                  size="small"
                  onClick={() => onView(collection)}
                  sx={{ bgcolor: 'background.paper' }}
                >
                  <Visibility />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton
                  size="small"
                  onClick={() => onEdit(collection)}
                  sx={{ bgcolor: 'background.paper' }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  onClick={() => onDelete(collection)}
                  sx={{ bgcolor: 'background.paper' }}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </Box>
          </Fade>
        </Box>

        {/* Collection Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Total Shoes
            </Typography>
            <Typography variant="h6">
              {totalShoes}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Total Value
            </Typography>
            <Typography variant="h6">
              ${totalValue.toLocaleString()}
            </Typography>
          </Grid>
        </Grid>

        {/* Collection Progress */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Collection Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {totalShoes}/20
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={(totalShoes / 20) * 100}
            sx={{ 
              height: 8, 
              borderRadius: 4,
              bgcolor: 'rgba(255,255,255,0.2)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
              }
            }}
          />
        </Box>

        {/* Shoe Previews */}
        {collection.shoes && collection.shoes.length > 0 && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Recent Shoes
            </Typography>
            <AvatarGroup max={5} sx={{ justifyContent: 'flex-start' }}>
              {collection.shoes.map((shoe) => (
                <Tooltip key={shoe._id} title={shoe.shoeName}>
                  <Avatar
                    alt={shoe.shoeName}
                    src={shoe.thumbnail}
                    sx={{ 
                      width: 40, 
                      height: 40,
                      border: '2px solid',
                      borderColor: 'background.paper',
                    }}
                  />
                </Tooltip>
              ))}
            </AvatarGroup>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
