"use client";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';

export default function Vault() {
  const [vault, setVault] = useState([]);
  const [collections, setCollections] = useState([]);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false); // State for showing the form
  const [selectedShoe, setSelectedShoe] = useState(null);
  const [isAlreadyAdded, setIsAlreadyAdded] = useState(false);
  
  // State for new shoe form
  const [newShoe, setNewShoe] = useState({
    brand: '',
    model: '',
    picture: ''
  });

  // Fetch Vault data
  useEffect(() => {
    const fetchVault = async () => {
      try {
        const response = await fetch('/api/vault');
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        setVault(data);
      } catch (error) {
        console.error('Error fetching vault:', error.message);
      }
    };
    fetchVault();
  }, []);

  // Fetch Collections when opening modal
  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/collections');
      if (!response.ok) throw new Error(response.statusText);
      const data = await response.json();
      setCollections(data);
    } catch (error) {
      console.error('Error fetching collections:', error.message);
    }
  };

  // Handle opening the Add to Collection modal
  const openCollectionModal = (shoe) => {
    setSelectedShoe(shoe);
    setIsAlreadyAdded(false); // Reset the error message state
    fetchCollections();
    setShowCollectionModal(true);
  };

  // Add Shoe to Collection
  const addToCollection = async (collectionName, styleID) => {
    try {
      const response = await fetch(`/api/collections/${collectionName}/addShoe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ styleID }),
      });

      if (!response.ok) {
        const { message } = await response.json();
        if (message === 'Shoe already in collection') setIsAlreadyAdded(true);
        throw new Error(response.statusText);
      }

      console.log('Shoe added to collection');
      fetchCollections();
    } catch (error) {
      console.error('Error adding shoe to collection:', error.message);
    }
  };

  // Remove Shoe from Collection
  const removeFromCollection = async (collectionName, styleID) => {
    try {
      const response = await fetch(`/api/collections/${collectionName}/addShoe`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ styleID }),
      });

      if (!response.ok) throw new Error(response.statusText);

      console.log('Shoe removed from collection');
      fetchCollections();
    } catch (error) {
      console.error('Error removing shoe from collection:', error.message);
    }
  };

  // Delete Shoe from Vault
  const handleDeleteFromVault = async (id) => {
    try {
      const response = await fetch('/api/vault', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error(response.statusText);

      setVault(vault.filter((shoe) => shoe._id !== id));
      setCollections((prevCollections) =>
        prevCollections.map((collection) => ({
          ...collection,
          shoes: collection.shoes.filter((shoe) => shoe._id !== id),
        }))
      );
      console.log('Shoe deleted from vault and updated collections');
    } catch (error) {
      console.error('Error deleting shoe from vault:', error.message);
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewShoe((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/vault', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newShoe),
      });

      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();
      setVault((prevVault) => [...prevVault, data]);
      setShowCreateForm(false);
      console.log('New shoe added to vault');
    } catch (error) {
      console.error('Error adding new shoe to vault:', error.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6 max-w-4xl dark:bg-gray-900 dark:text-white">
        <h1 className="text-4xl font-extrabold mb-6 text-center">My Vault</h1>

        <div className="mb-4 flex justify-end">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
            onClick={() => setShowCreateForm(true)}
          >
            Create Form
          </button>
        </div>

        {showCreateForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">Add New Shoe</h2>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={newShoe.brand}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">Shoe Name</label>
                  <input
                    type="text"
                    name="model"
                    value={newShoe.model}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">Thumbnail URL</label>
                  <input
                    type="url"
                    name="picture"
                    value={newShoe.picture}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  Add Shoe
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300 ml-2"
                  onClick={() => setShowCreateForm(false)}
                >
                  Close
                </button>
              </form>
            </div>
          </div>
        )}

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
                      onClick={() => openCollectionModal(shoe)}
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
            {isAlreadyAdded && (
              <p className="text-red-500 mb-4">The shoe is already added</p>
            )}
            <div className="mb-4">
              {collections.map((collection) => {
                const isShoeInCollection = collection.shoes.some(
                  (shoe) => shoe.styleID === selectedShoe.styleID
                );

                return (
                  <div key={collection._id} className="mb-2 flex justify-between items-center">
                    <button
                      className={`cursor-pointer p-2 rounded-full transition-transform duration-300 ${
                        isShoeInCollection ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                      onClick={() =>
                        isShoeInCollection
                          ? setIsAlreadyAdded(true)
                          : addToCollection(collection.name, selectedShoe.styleID)
                      }
                    >
                      <LibraryAddIcon />
                    </button>
                    <span>{collection.name}</span>
                    <button
                      className="cursor-pointer p-2 rounded-full transition-transform duration-300 bg-gray-300 hover:bg-red-500"
                      onClick={() => removeFromCollection(collection.name, selectedShoe.styleID)}
                    >
                      <DeleteOutlineIcon />
                    </button>
                  </div>
                );
              })}
            </div>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700 w-full transition-colors duration-300 mt-2"
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
