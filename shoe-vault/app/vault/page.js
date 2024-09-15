"use client";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";

export default function Vault() {
  const [vault, setVault] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [selectedShoe, setSelectedShoe] = useState(null);
  const [isChecked, setIsChecked] = useState({}); // Track checkbox states per collection and shoe

  // Fetch vault data from MongoDB
  useEffect(() => {
    const fetchVault = async () => {
      try {
        const response = await fetch('/api/vault');
        if (response.ok) {
          const data = await response.json();
          setVault(data);
        } else {
          console.error('Error fetching vault:', response.statusText);
        }
      } catch (err) {
        console.error('Error fetching vault:', err);
      }
    };
    fetchVault();
  }, []);

  // Load collections from localStorage
  useEffect(() => {
    const storedCollections = JSON.parse(localStorage.getItem("collections")) || [];
    setCollections(storedCollections);
  }, []);

  // Initialize checkbox states
  useEffect(() => {
    const initialState = {};
    collections.forEach((collection) => {
      collection.shoes.forEach((shoe) => {
        initialState[`${collection.name}-${shoe.id}`] = true;
      });
    });
    setIsChecked(initialState);
  }, [collections]);

  const handleAddToCollection = (shoe) => {
    setSelectedShoe(shoe);

    const currentState = collections.reduce((state, collection) => {
      state[`${collection.name}-${shoe.id}`] = collection.shoes.some((s) => s.id === shoe.id);
      return state;
    }, {});

    setIsChecked(currentState);
    setShowCollectionModal(true);
  };

  const handleCollectionChange = (collectionName, shoeId, checked) => {
    const updatedCollections = collections.map((collection) => {
      if (collection.name === collectionName) {
        if (checked) {
          return { ...collection, shoes: [...collection.shoes, selectedShoe] };
        } else {
          return { ...collection, shoes: collection.shoes.filter((shoe) => shoe.id !== shoeId) };
        }
      }
      return collection;
    });

    setCollections(updatedCollections);
    localStorage.setItem("collections", JSON.stringify(updatedCollections));

    // Update the checkbox state for this particular shoe and collection using prevState
    setIsChecked((prevState) => ({
      ...prevState,
      [`${collectionName}-${shoeId}`]: checked,
    }));
  };

  const handleDeleteFromVault = async (id) => {
    try {
      const response = await fetch('/api/vault', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        // Optimistically update the vault state
        const updatedVault = vault.filter((shoe) => shoe._id !== id);
        setVault(updatedVault);

        // Update collections to remove the deleted shoe
        const updatedCollections = collections.map((collection) => ({
          ...collection,
          shoes: collection.shoes.filter((shoe) => shoe._id !== id),
        }));
        setCollections(updatedCollections);
        localStorage.setItem("collections", JSON.stringify(updatedCollections));
      } else {
        console.error('Error deleting shoe from vault:', response.statusText);
      }
    } catch (err) {
      console.error('Error deleting shoe from vault:', err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6 max-w-4xl dark:bg-gray-900 dark:text-white">
        <h1 className="text-4xl font-extrabold mb-6 text-center">My Vault</h1>

        {vault.length === 0 ? (
          <p className="text-center text-gray-500">No shoes in the vault yet.</p>
        ) : (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Shoes in Vault</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vault.map((shoe) => (
                <li
                  key={shoe._id}
                  className="p-4 border border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 transition hover:scale-105"
                >
                  <h3 className="text-xl font-bold mb-2">{shoe.shoeName}</h3>
                  <p className="text-md mb-2">{shoe.brand}</p>
                  <img
                    className="w-full h-48 object-cover rounded-lg"
                    src={shoe.thumbnail}
                    alt={shoe.shoeName}
                  />
                  <div className="mt-4 flex justify-between">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                      onClick={() => handleAddToCollection(shoe)}
                    >
                      Add to Collection
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
                      onClick={() => handleDeleteFromVault(shoe._id)}
                    >
                      Delete from Vault
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {showCollectionModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add to Collection</h2>
            <div className="mb-4">
              {collections.map((collection) => (
                <div key={collection.name} className="mb-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={isChecked[`${collection.name}-${selectedShoe.id}`] || false}
                      onChange={(e) =>
                        handleCollectionChange(collection.name, selectedShoe.id, e.target.checked)
                      }
                    />
                    {collection.name}
                  </label>
                </div>
              ))}
            </div>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700 w-full transition-colors duration-300"
              onClick={() => setShowCollectionModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}