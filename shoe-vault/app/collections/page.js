"use client";

import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Typography,
  Modal,
  TextField,
  Box,
  IconButton,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import EditIcon from '@mui/icons-material/Edit';

export default function Collections() {
  const [collections, setCollections] = useState([]);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const router = useRouter(); // Initialize router
  const [isEditing, setIsEditing] = useState(false);
  const [editingCollectionId, setEditingCollectionId] = useState(null);
  const [newName, setNewName] = useState("");

  // Load collections from the database when the component mounts
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch("/api/collections");
        const data = await response.json();
        setCollections(data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };

    fetchCollections();
  }, []);

  // Handle creating a new collection
  const handleCreateNewCollection = async () => {
    if (!newCollectionName.trim()) return;

    const newCollection = {
      name: newCollectionName, // Pass the collection name as expected by the backend
    };

    try {
      const response = await fetch("/api/collections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCollection),
      });

      if (response.ok) {
        const createdCollection = await response.json();
        setCollections([...collections, createdCollection]);
        setNewCollectionName("");
        setShowCollectionModal(false);
      } else {
        console.error("Error creating collection:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating collection:", error);
    }
  };

  // Handle navigating to the collection view
  const handleViewCollection = (collectionName) => {
    router.push(`/collections/${collectionName.toLowerCase()}`); // Navigate to the dynamic collection page
  };

  // Handle deleting a collection
  const handleDeleteCollection = async (collectionName) => {
    try {
      const response = await fetch(`/api/collections`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: collectionName }), // Send 'name' to backend instead of 'id'
      });

      if (response.ok) {
        setCollections(
          collections.filter((collection) => collection.name !== collectionName)
        );
      } else {
        console.error("Error deleting collection:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting collection:", error);
    }
  };

  // Handle editing a collection name
  const handleEditClick = (collectionId, currentName) => {
    setIsEditing(true);
    setEditingCollectionId(collectionId);
    setNewName(currentName);
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch('/api/collections', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ collectionId: editingCollectionId, newName }),
      });

      if (!response.ok) {
        throw new Error('Failed to update collection');
      }

      const updatedCollection = await response.json();
      setCollections(collections.map(collection =>
        collection._id === editingCollectionId ? updatedCollection : collection
      ));
      setIsEditing(false);
      setEditingCollectionId(null);
      setNewName("");
    } catch (error) {
      console.error('Error updating collection:', error);
    }
  };

  // Modal style
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "white", // Ensuring the modal has a white background
    borderRadius: 4, // Rounded corners
    boxShadow: 24,
    p: 4, // Padding for content
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
              <Grid item xs={12} sm={6} md={4} lg={3} key={collection._id}>
                <Card>
  <CardActions style={{ justifyContent: 'flex-end' }}>
    <IconButton
      size="small"
      color="default"
      onClick={() => handleEditClick(collection._id, collection.name)}
    >
      <EditIcon />
    </IconButton>
  </CardActions>
  {/* Display the first shoe in the collection as a preview */}
  {Array.isArray(collection.shoes) && collection.shoes.length > 0 ? (
    <CardMedia
      component="img"
      height="150"
      image={
        collection.shoes[0]?.thumbnail ||
        "https://via.placeholder.com/150"
      } // Fallback if thumbnail is null
      alt={collection.shoes[0]?.shoeName || "No Shoes"} // Fallback if shoeName is null
    />
  ) : (
    <CardMedia
      component="img"
      height="150"
      image="https://via.placeholder.com/150" // Placeholder image if no shoes exist
      alt="No Shoes"
    />
  )}

  <CardContent>
    <Typography variant="h6" component="div">
      {collection.name}
    </Typography>
    <Typography variant="body2" color="textSecondary">
      {Array.isArray(collection.shoes)
        ? collection.shoes.length
        : 0}{" "}
      shoes in this collection
    </Typography>
  </CardContent>
  <CardActions>
    <Button
      size="small"
      color="primary"
      onClick={() => handleViewCollection(collection.name)}
    >
      View
    </Button>
    <Button
      size="small"
      color="secondary"
      onClick={() => handleDeleteCollection(collection.name)}
    >
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
          <Typography
            id="create-collection-modal"
            variant="h6"
            component="h2"
            align="center"
          >
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

      <Modal
        open={isEditing}
        onClose={() => setIsEditing(false)}
        aria-labelledby="edit-collection-modal"
      >
        <Box sx={modalStyle}>
          <Typography
            id="edit-collection-modal"
            variant="h6"
            component="h2"
            align="center"
          >
            Edit Collection Name
          </Typography>
          <TextField
            fullWidth
            label="New Collection Name"
            variant="outlined"
            margin="normal"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSaveClick}
          >
            Save
          </Button>
          <Button
            variant="text"
            color="secondary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => setIsEditing(false)}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
}