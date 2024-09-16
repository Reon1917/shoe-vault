"use client";

import { useParams, useRouter } from 'next/navigation';  // Import useRouter for navigation
import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';  // Assuming you have Navbar component
import ArrowBackIcon from '@mui/icons-material/ArrowBack';  // Import back arrow icon

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
          console.log('Fetched collection data:', data);  // Debugging statement
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

  if (!collection) {
    return <div>Collection not found.</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6 max-w-7xl">
        <h1 className="text-4xl font-bold mb-6">Collection: {collectionName}</h1>
        
        {/* Back Button with Blue Arrow */}
        <button
          onClick={() => router.push('/collections')}  // Navigate back to the collections page
          className="mb-4 p-2 bg-transparent hover:bg-gray-200 rounded-full transition-colors duration-300"
        >
          <ArrowBackIcon fontSize="medium" sx={{ color: '#1976d2' }} />  {/* Blue back arrow icon */}
        </button>

        {Array.isArray(collection) && collection.length === 0 ? (
          <p className="text-center text-gray-500">No shoes in this collection.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.isArray(collection) && collection.map((shoe) => (
              <div key={shoe.styleID} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                <div className="p-4">
                  <h3 className="font-bold text-xl mb-2">{shoe.shoeName}</h3>
                  <p className="text-md mb-2">{shoe.brand}</p>
                  <img
                    className="w-full h-48 object-cover rounded-lg"
                    src={shoe.thumbnail}
                    alt={shoe.shoeName}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}