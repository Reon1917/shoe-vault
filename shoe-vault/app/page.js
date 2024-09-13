"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box'; // Import Box and CircularProgress for loading spinner

export default function Home() {
  const [keyword, setKeyword] = useState('');
  const [sneakers, setSneakers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vaultErrors, setVaultErrors] = useState({}); // State for vault error messages
  const router = useRouter();

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/sneaks?keyword=${keyword}`);
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
  };

  const handleShoeClick = (styleID) => {
    router.push(`/sneaks/${styleID}`);
  };

  const addToVault = (shoe) => {
    const storedVault = JSON.parse(localStorage.getItem('vault')) || [];
    const isAlreadyInVault = storedVault.some(item => item.styleID === shoe.styleID);

    if (isAlreadyInVault) {
      setVaultErrors(prevErrors => ({ ...prevErrors, [shoe.styleID]: "It is already saved" }));
    } else {
      storedVault.push(shoe);
      localStorage.setItem('vault', JSON.stringify(storedVault));
      setVaultErrors(prevErrors => ({ ...prevErrors, [shoe.styleID]: null })); // Clear any previous error message
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6 max-w-4xl dark:bg-gray-900 dark:text-white">
        <h1 className="text-4xl font-extrabold mb-6 text-center">Sneaker Search</h1>
        <form onSubmit={handleSearch} className="flex flex-col items-center mb-6">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search for sneakers..."
            className="w-full md:w-1/2 p-2 mb-4 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700">
            Search
          </button>
        </form>
        
        {loading ? (
          // Show CircularProgress while loading
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sneakers.map((sneaker) => (
              <Paper
                key={sneaker.styleID}
                elevation={3}
                sx={{
                  padding: '20px',
                  backgroundColor: 'white',
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <h2 className="text-2xl font-bold mb-2">{sneaker.shoeName}</h2>
                <p className="text-lg mb-2">{sneaker.brand}</p>
                <img
                  className="w-full h-48 object-cover rounded-lg"
                  src={sneaker.thumbnail}
                  alt={sneaker.shoeName}
                />
                <div className="flex justify-between mt-4">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleShoeClick(sneaker.styleID)}
                    sx={{
                      padding: { xs: '8px 16px', sm: '10px 20px' },
                      fontSize: { xs: '14px', sm: '16px' },
                      backgroundColor: '#1976d2',
                      '&:hover': {
                        backgroundColor: 'darkblue',
                      },
                    }}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => addToVault(sneaker)}
                    sx={{
                      padding: { xs: '8px 16px', sm: '10px 20px' },
                      fontSize: { xs: '14px', sm: '16px' },
                      '&:hover': {
                        backgroundColor: 'darkgreen',
                      },
                      transition: 'transform 0.2s',
                      '&:active': {
                        transform: 'scale(0.95)',
                      },
                    }}
                  >
                    Add to Vault
                  </Button>
                </div>
                {vaultErrors[sneaker.styleID] && (
                  <p className="text-center text-red-500 mt-2">{vaultErrors[sneaker.styleID]}</p>
                )} {/* Display vault error message */}
              </Paper>
            ))}
          </ul>
        )}

        {error && <p className="text-center text-red-500">Error: {error}</p>}
      </div>
    </div>
  );
}