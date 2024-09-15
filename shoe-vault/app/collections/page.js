"use client";

import React, { useState, useEffect } from 'react';
import { Grid, Card, CardMedia, CardContent, CardActions, Button, Typography, Modal, TextField, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import Navbar from "../../components/Navbar";

export default function Collections() {
  const [collections, setCollections] = useState([]);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const router = useRouter();  // Initialize router

  // Load collections from localStorage when the component mounts
  useEffect(() => {
    const storedCollections = JSON.parse(localStorage.getItem("collections")) || [];
    setCollections(storedCollections);
  }, []);

  // Handle creating a new collection
  const handleCreateNewCollection = () => {
    if (!newCollectionName.trim()) return;

    const newCollection = {
      name: newCollectionName,
      shoes: [],
    };
    const updatedCollections = [...collections, newCollection];

    setCollections(updatedCollections);
    localStorage.setItem("collections", JSON.stringify(updatedCollections));
    setNewCollectionName("");
    setShowCollectionModal(false);
  };

  // Handle navigating to the collection view
  const handleViewCollection = (collectionName) => {
    router.push(`/collections/${collectionName.toLowerCase()}`);  // Navigate to the dynamic collection page
  };

  // Handle deleting a collection
  const handleDeleteCollection = (collectionName) => {
    const updatedCollections = collections.filter((collection) => collection.name !== collectionName);
    setCollections(updatedCollections);
    localStorage.setItem("collections", JSON.stringify(updatedCollections));
  };

  // Modal style
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'white',  // Ensuring the modal has a white background
    borderRadius: 4,  // Rounded corners
    boxShadow: 24,
    p: 4,  // Padding for content
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6 max-w-7xl">
        <Typography variant="h4" align="center" gutterBottom>
          My Collections
        </Typography>

        <Button
  variant="contained"
  color="primary"
  onClick={() => setShowCollectionModal(true)}
  sx={{ mb: 4 }}
>
  Create New Collection
</Button>

{collections.length === 0 ? (
  <Typography variant="body1" align="center" color="textSecondary">
    No collections yet.
  </Typography>
) : (
  <Grid container spacing={4}>
    {collections.map((collection) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={collection.name}>
        <Card>
          {/* Display the first shoe in the collection as a preview */}
          {Array.isArray(collection.shoes) && collection.shoes.length > 0 ? (
            <CardMedia
              component="img"
              height="150"
              image={collection.shoes[0].thumbnail}
              alt={collection.shoes[0].shoeName}
            />
          ) : (
            <CardMedia
              component="img"
              height="150"
              image="https://via.placeholder.com/150"  // Placeholder image if no shoes exist
              alt="No Shoes"
            />
          )}

          <CardContent>
            <Typography variant="h6" component="div">
              {collection.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {Array.isArray(collection.shoes) ? collection.shoes.length : 0} shoes in this collection
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" color="primary" onClick={() => handleViewCollection(collection.name)}>
              View
            </Button>
            <Button size="small" color="secondary" onClick={() => handleDeleteCollection(collection.name)}>
              Delete
            </Button>
          </CardActions>
        </Card>
      </Grid>
    ))}
  </Grid>
)}
      </div>

      <Modal
        open={showCollectionModal}
        onClose={() => setShowCollectionModal(false)}
        aria-labelledby="create-collection-modal"
      >
        <Box sx={modalStyle}>
          <Typography id="create-collection-modal" variant="h6" component="h2" align="center">
            Create New Collection
          </Typography>
          <TextField
            fullWidth
            label="New Collection Name"
            variant="outlined"
            margin="normal"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleCreateNewCollection}
          >
            Create
          </Button>
          <Button
            variant="text"
            color="secondary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => setShowCollectionModal(false)}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
