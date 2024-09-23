"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CircularProgress, Button, Card, CardMedia, CardContent, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, IconButton, Box, Fab } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import Navbar from '../../../components/Navbar';
import ErrorPage from "@/app/errorPage/page";

export default function SneakerDetail() {
  const [sneaker, setSneaker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vaultError, setVaultError] = useState(null); // State for vault error message
  const { styleID } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!styleID) return;

    async function fetchSneaker() {
      try {
        const response = await fetch(`/api/sneaks/${styleID}`);
        const data = await response.json();
        if (response.ok) {
          setSneaker(data);
        } else if (response.status === 404) {
          setError("404");
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSneaker();
  }, [styleID]);

  const addToVault = async (shoe) => {
    try {
      const response = await fetch('/api/vault', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ styleID: shoe.styleID, shoeName: shoe.shoeName, brand: shoe.brand, thumbnail: shoe.thumbnail }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setVaultError(null); // Clear any previous error message
      } else {
        setVaultError(data.error);
      }
    } catch (err) {
      setVaultError('An error occurred while adding the shoe to the vault');
    }
  };

  if (loading) return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <CircularProgress />
    </Box>
  );

  if (error === "404") return <ErrorPage />;

  if (error) return <Typography color="error" textAlign="center">Error: {error}</Typography>;

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6 max-w-4xl dark:bg-gray-900 dark:text-white">
        <IconButton onClick={() => router.back()} color="primary" sx={{ mb: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
          {sneaker.shoeName}
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={sneaker.thumbnail}
                alt={sneaker.shoeName}
              />
              <CardContent>
                <Typography variant="h5">{sneaker.shoeName}</Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Brand:</strong> {sneaker.brand}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Silhouette:</strong> {sneaker.silhouette}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Colorway:</strong> {sneaker.colorway}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Retail Price:</strong> ${sneaker.retailPrice}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>Release Date:</strong> {sneaker.releaseDate}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" paragraph>
              {sneaker.description}
            </Typography>
            {sneaker.lowestResellPrice && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Lowest Resell Prices</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ul>
                    {Object.entries(sneaker.lowestResellPrice).map(([marketplace, price]) => (
                      <li key={marketplace}>
                        {marketplace}: ${price}
                      </li>
                    ))}
                  </ul>
                </AccordionDetails>
              </Accordion>
            )}
            {sneaker.resellLinks && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Resell Links</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ul>
                    {Object.entries(sneaker.resellLinks).map(([marketplace, link]) => (
                      <li key={marketplace}>
                        <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          {marketplace}
                        </a>
                      </li>
                    ))}
                  </ul>
                </AccordionDetails>
              </Accordion>
            )}
            {sneaker.imageLinks && sneaker.imageLinks.length > 0 && (
              <Box mt={4}>
                <Typography variant="h6" gutterBottom>
                  Images
                </Typography>
                <Grid container spacing={2}>
                  {sneaker.imageLinks.map((image, index) => (
                    <Grid item xs={6} md={4} key={index}>
                      <img
                        src={image}
                        alt={`${sneaker.shoeName} image ${index + 1}`}
                        className="rounded-lg shadow-md"
                        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Grid>
        </Grid>
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => addToVault(sneaker)}
          sx={{ position: "fixed", bottom: 16, right: 16 }}
        >
          <AddIcon />
        </Fab>
        {vaultError && <Typography color="error" textAlign="center" sx={{ mt: 2 }}>{vaultError}</Typography>} {/* Display vault error message */}
      </div>
    </div>
  );
}