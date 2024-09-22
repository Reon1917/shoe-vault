"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import axios from "axios";

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [sneakers, setSneakers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vault, setVault] = useState([]);
  const [vaultErrors, setVaultErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchVault = async () => {
      try {
        const response = await axios.get("/api/vault");
        setVault(response.data);
      } catch (err) {
        console.error("Error fetching vault:", err);
      }
    };

    fetchVault();
  }, []);

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

  const addToVault = async (shoe) => {
    try {
      const shoeData = {
        styleID: shoe.styleID,
        shoeName: shoe.shoeName,
        brand: shoe.brand,
        thumbnail: shoe.thumbnail,
      };

      const response = await fetch("/api/vault", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shoeData),
      });

      const data = await response.json();

      if (response.ok) {
        setVaultErrors((prevErrors) => ({
          ...prevErrors,
          [shoe.styleID]: null,
        }));
        setVault((prevVault) => [...prevVault, data]);
      } else if (response.status === 409) {
        setVaultErrors((prevErrors) => ({
          ...prevErrors,
          [shoe.styleID]: "Shoe is already saved",
        }));
      } else {
        console.error("Server error:", data.error);
        setVaultErrors((prevErrors) => ({
          ...prevErrors,
          [shoe.styleID]: `Error: ${data.error}`,
        }));
      }
    } catch (err) {
      console.error("Client-side error:", err);
      setVaultErrors((prevErrors) => ({
        ...prevErrors,
        [shoe.styleID]: `An error occurred: ${err.message}`,
      }));
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6 max-w-4xl dark:bg-gray-900 dark:text-white">
        <h1 className="text-4xl font-extrabold mb-6 text-center">
          Sneaker Search
        </h1>
        <form
          onSubmit={handleSearch}
          className="flex flex-col items-center mb-6"
        >
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search for sneakers..."
            className="w-full md:w-1/2 p-2 mb-4 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              background: "linear-gradient(90deg, #1976D2 0%, #42A5F5 100%)",
              color: "#fff",
              padding: { xs: "6px 12px", sm: "8px 16px" }, // Smaller padding
              fontSize: { xs: "12px", sm: "14px" }, // Smaller font size
              borderRadius: "50px",
              boxShadow: "0 4px 8px rgba(25, 118, 210, 0.2)",
              "&:hover": {
                background: "linear-gradient(90deg, #1565C0 0%, #2196F3 100%)",
                boxShadow: "0 6px 12px rgba(25, 118, 210, 0.3)",
              },
              transition: "all 0.3s ease-in-out",
              "&:active": {
                transform: "scale(0.95)",
              },
            }}
          >
            Search
          </Button>
        </form>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sneakers.map((sneaker) => (
              <Paper
                key={sneaker.styleID}
                elevation={3}
                sx={{
                  padding: "20px",
                  backgroundColor: "white",
                  "&:hover": {
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
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
                    onClick={() => handleShoeClick(sneaker.styleID)}
                    sx={{
                      background: "linear-gradient(90deg, #1976D2 0%, #42A5F5 100%)",
                      color: "#fff",
                      padding: { xs: "6px 12px", sm: "8px 16px" }, // Smaller padding
                      fontSize: { xs: "12px", sm: "14px" }, // Smaller font size
                      boxShadow: "0 4px 8px rgba(25, 118, 210, 0.2)",
                      "&:hover": {
                        background: "linear-gradient(90deg, #1565C0 0%, #2196F3 100%)",
                        boxShadow: "0 6px 12px rgba(25, 118, 210, 0.3)",
                      },
                      borderRadius: "50px",
                      transition: "all 0.3s ease-in-out",
                      "&:active": {
                        transform: "scale(0.95)",
                      },
                    }}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => addToVault(sneaker)}
                    sx={{
                      background: "linear-gradient(90deg, #0288D1 0%, #03A9F4 100%)",
                      color: "#fff",
                      padding: { xs: "6px 12px", sm: "8px 16px" }, // Smaller padding
                      fontSize: { xs: "12px", sm: "14px" }, // Smaller font size
                      boxShadow: "0 4px 8px rgba(3, 169, 244, 0.2)",
                      "&:hover": {
                        background: "linear-gradient(90deg, #0277BD 0%, #039BE5 100%)",
                        boxShadow: "0 6px 12px rgba(3, 169, 244, 0.3)",
                      },
                      borderRadius: "50px",
                      transition: "all 0.3s ease-in-out",
                      "&:active": {
                        transform: "scale(0.95)",
                      },
                    }}
                  >
                    Add to Vault
                  </Button>
                </div>
                {vaultErrors[sneaker.styleID] && (
                  <p className="text-center text-red-500 mt-2">
                    {vaultErrors[sneaker.styleID]}
                  </p>
                )}
              </Paper>
            ))}
          </ul>
        )}

        {error && <p className="text-center text-red-500">Error: {error}</p>}
      </div>
    </div>
  );
}
