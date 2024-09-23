"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';

export default function CollectionDetail() {
  const params = useParams();  // Get the dynamic route parameters
  const { collectionName } = params;  // Extract collection name from the URL
  const [collection, setCollection] = useState(null);
  const router = useRouter();  // Initialize router for navigation

  // Fetch the collection details from the server when the component mounts
  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await fetch(`/api/collections/${collectionName}/collectionDetails?collectionName=${collectionName}`);
        if (response.ok) {
          const data = await response.json();
          setCollection(data);
        } else {
          console.error('Error fetching collection:', response.statusText);
        }
      } catch (err) {
        console.error('Error fetching collection:', err);
      }
    };
    fetchCollection();
  }, [collectionName]);

  // Function to handle deleting a shoe from the collection
  const handleDeleteShoe = async (styleID) => {
    try {
      const response = await fetch(`/api/collections/${collectionName}/collectionDetails/${styleID}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Update the collection state to remove the deleted shoe
        setCollection((prevCollection) => ({
          ...prevCollection,
          shoes: prevCollection.shoes.filter((shoe) => shoe.styleID !== styleID),
        }));
      } else {
        console.error('Error deleting shoe:', response.statusText);
      }
    } catch (err) {
      console.error('Error deleting shoe:', err);
    }
  };

  if (!collection) {
    return <div>Collection not found.</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center">
          <h1 className="text-4xl font-bold mb-6">
            {`Collection: ${collection.collectionName}`} {/* Show exact name from DB */}
          </h1>
        </div>

        {/* Back Button with Blue Arrow */}
        <button
          onClick={() => router.push('/collections')}  // Navigate back to the collections page
          className="mb-4 p-2 bg-transparent hover:bg-gray-200 rounded-full transition-colors duration-300"
        >
          <ArrowBackIcon fontSize="medium" sx={{ color: '#1976d2' }} />  {/* Blue back arrow icon */}
        </button>

        {Array.isArray(collection.shoes) && collection.shoes.length === 0 ? (
          <p className="text-center text-gray-500">No shoes in this collection.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.isArray(collection.shoes) && collection.shoes.map((shoe) => (
              <div key={shoe.styleID} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col">
                <div className="p-4 flex-grow">
                  <h3 className="font-bold text-xl mb-2">{shoe.shoeName}</h3>
                  <p className="text-md mb-2">{shoe.brand}</p>
                  <img
                    className="w-full h-48 object-cover rounded-lg"
                    src={shoe.thumbnail}
                    alt={shoe.shoeName}
                  />
                </div>
                {/* Delete Button */}
                <div className="p-4 flex justify-end">
                  <button
                    onClick={() => handleDeleteShoe(shoe.styleID)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-300"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}