'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  Chip,
  Tooltip,
  Fade,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Edit,
  Delete,
  AddShoppingCart,
} from '@mui/icons-material';

export default function ShoeCard({ shoe, onFavorite, onEdit, onDelete, onAddToCollection }) {
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

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
        overflow: 'visible',
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={shoe.thumbnail}
          alt={shoe.shoeName}
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.3s ease-in-out',
            ...(isHovered && {
              transform: 'scale(1.05)',
            }),
          }}
        />
        <Fade in={isHovered}>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              p: 1,
              display: 'flex',
              gap: 1,
              background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.7))',
            }}
          >
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={() => onEdit(shoe)}
                sx={{ bgcolor: 'background.paper' }}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={() => onDelete(shoe)}
                sx={{ bgcolor: 'background.paper' }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add to Collection">
              <IconButton
                size="small"
                onClick={() => onAddToCollection(shoe)}
                sx={{ bgcolor: 'background.paper' }}
              >
                <AddShoppingCart />
              </IconButton>
            </Tooltip>
          </Box>
        </Fade>
      </Box>

      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography variant="h6" component="div" gutterBottom>
              {shoe.shoeName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {shoe.brand}
            </Typography>
          </Box>
          <IconButton
            onClick={() => onFavorite(shoe)}
            sx={{ mt: -1 }}
          >
            {shoe.favorite ? (
              <Favorite color="error" />
            ) : (
              <FavoriteBorder />
            )}
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          {shoe.condition && (
            <Chip
              label={shoe.condition}
              size="small"
              color={
                shoe.condition === 'New' ? 'success' :
                shoe.condition === 'Like New' ? 'primary' :
                shoe.condition === 'Good' ? 'info' :
                shoe.condition === 'Fair' ? 'warning' : 'error'
              }
            />
          )}
          {shoe.releaseDate && (
            <Chip
              label={new Date(shoe.releaseDate).getFullYear()}
              size="small"
              variant="outlined"
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {shoe.retailPrice && (
            <Typography variant="body1" color="text.primary" fontWeight="bold">
              {formatPrice(shoe.retailPrice)}
            </Typography>
          )}
          {shoe.purchasePrice && (
            <Typography variant="body2" color="text.secondary">
              Paid: {formatPrice(shoe.purchasePrice)}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
