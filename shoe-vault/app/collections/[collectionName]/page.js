"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';

export default function CollectionDetail() {
  const params = useParams();  // Get the dynamic route parameters
  const { collectionName } = params;  // Extract collection name from the URL
  const [collection, setCollection] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Track if the user is in "edit mode"
  const [newCollectionName, setNewCollectionName] = useState(''); // New collection name for editing
  const router = useRouter();  // Initialize router for navigation

  // Fetch the collection details from the server when the component mounts
  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await fetch(`/api/collections/${collectionName}/collectionDetails?collectionName=${collectionName}`);
        if (response.ok) {
          const data = await response.json();
          setCollection(data);
          setNewCollectionName(data.collectionName);  // Set the collection name properly from DB
        } else {
          console.error('Error fetching collection:', response.statusText);
        }
      } catch (err) {
        console.error('Error fetching collection:', err);
      }
    };
    fetchCollection();
  }, [collectionName]);

  // Handle saving the new collection name
  const handleSave = async () => {
    try {
      const response = await fetch(`/api/collections/${collectionName}/collectionDetails`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newCollectionName }),  // Send the new collection name
      });

      if (!response.ok) throw new Error("Error updating collection");

      const updatedCollection = await response.json();
      setIsEditing(false); // Exit "edit mode"

      // If only capitalization changes, use window.location.href to refresh the page
      if (updatedCollection.collectionName.toLowerCase() === collectionName.toLowerCase()) {
        window.location.href = `/collections/${updatedCollection.collectionName}`;
      } else {
        // Navigate to new collection name URL
        router.push(`/collections/${updatedCollection.collectionName}`);
      }
    } catch (error) {
      console.error("Error saving new collection name:", error);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setNewCollectionName(collection.collectionName); // Reset the input field to the original name
  };

  if (!collection) {
    return <div>Collection not found.</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Conditionally show input or collection name based on "edit mode" */}
        <div className="flex items-center">
          <h1 className="text-4xl font-bold mb-6">
            {isEditing ? (
              <input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}  // Update new collection name
                className="border border-gray-300 rounded-lg p-2"
              />
            ) : (
              `Collection: ${collection.collectionName}` // Show exact name from DB
            )}
          </h1>

          {/* Edit Icon Next to Collection Name */}
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="ml-3"
            >
              <EditIcon fontSize="medium" sx={{ color: '#1976d2' }} />
            </button>
          )}
        </div>

        {/* Back Button with Blue Arrow */}
        <button
          onClick={() => router.push('/collections')}  // Navigate back to the collections page
          className="mb-4 p-2 bg-transparent hover:bg-gray-200 rounded-full transition-colors duration-300"
        >
          <ArrowBackIcon fontSize="medium" sx={{ color: '#1976d2' }} />  {/* Blue back arrow icon */}
        </button>

        {/* Edit and Save Buttons */}
        {isEditing ? (
          <div>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 ml-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
            >
              Cancel
            </button>
          </div>
        ) : null}

        {Array.isArray(collection.shoes) && collection.shoes.length === 0 ? (
          <p className="text-center text-gray-500">No shoes in this collection.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.isArray(collection.shoes) && collection.shoes.map((shoe) => (
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
