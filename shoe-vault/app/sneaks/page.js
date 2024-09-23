"use client";
import { useEffect, useState } from 'react';
import { Link } from 'next/link';
import { Grid, Card, CardContent, Typography, CardMedia } from '@mui/material';

export default function SneaksPage() {
  const [sneakers, setSneakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSneakers() {
      try {
        const response = await fetch('/api/sneaks');
        const data = await response.json();
        if (response.ok) {
          setSneakers(data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSneakers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-6 max-w-4xl dark:bg-gray-900 dark:text-white">
      <Typography variant="h4" component="h1" gutterBottom>
        Sneakers List
      </Typography>
      <Grid container spacing={4}>
        {sneakers.map(sneaker => (
          <Grid item xs={12} sm={6} md={4} key={sneaker.styleID}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={sneaker.thumbnail}
                alt={sneaker.shoeName}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {sneaker.shoeName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {sneaker.brand}
                </Typography>
                <Link href={`/sneaks/${sneaker.styleID}`}>View Details</Link>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
