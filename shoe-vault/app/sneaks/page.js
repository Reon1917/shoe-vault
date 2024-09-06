"use client";
import { useEffect, useState } from 'react';

export default function Sneaks() {
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
    <div>
      <h1>Sneakers</h1>
      <ul>
        {sneakers.map((sneaker) => (
          <li key={sneaker.styleID}>
            <h2>{sneaker.shoeName}</h2>
            <p>{sneaker.brand}</p>
            <img src={sneaker.thumbnail} alt={sneaker.shoeName} width={100} />
          </li>
        ))}
      </ul>
    </div>
  );
}