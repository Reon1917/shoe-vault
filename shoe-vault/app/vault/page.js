"use client";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { v4 as uuidv4 } from 'uuid';

export default function Vault() {
  const [vault, setVault] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [selectedShoe, setSelectedShoe] = useState(null);

  useEffect(() => {
    const storedVault = JSON.parse(localStorage.getItem("vault")) || [];
    const storedCollections = JSON.parse(localStorage.getItem("collections")) || [];
  
    // Ensure each shoe in the vault has a unique id
    const updatedVault = storedVault.map(shoe => ({
      ...shoe,
      id: shoe?.id || uuidv4(),
    }));
  
    // Ensure each shoe in the collections has a unique id
    const updatedCollections = storedCollections.map(collection => ({
      ...collection,
      shoes: collection.shoes.map(shoe => ({
        ...shoe,
        id: shoe?.id || uuidv4(),
      })),
    }));
  
    setVault(updatedVault);
    setCollections(updatedCollections);
  
    // Update local storage with the new ids
    localStorage.setItem("vault", JSON.stringify(updatedVault));
    localStorage.setItem("collections", JSON.stringify(updatedCollections));
  }, []);

  const handleAddToCollection = (shoe) => {
    setSelectedShoe(shoe);
    setShowCollectionModal(true);
  };

  const handleCollectionChange = (collectionName, isChecked) => {
    const updatedCollections = [...collections];
    const collection = updatedCollections.find((c) => c.name === collectionName);

    if (isChecked && collection) {
      collection.shoes.push(selectedShoe);
    } else if (!isChecked && collection) {
      collection.shoes = collection.shoes.filter((s) => s.id !== selectedShoe.id);
    }

    setCollections(updatedCollections);
    localStorage.setItem("collections", JSON.stringify(updatedCollections));
  };

  const handleCreateNewCollection = () => {
    if (!newCollectionName.trim()) return;

    const newCollection = {
      name: newCollectionName,
      shoes: selectedShoe ? [selectedShoe] : [],
    };
    const updatedCollections = [...collections, newCollection];

    setCollections(updatedCollections);
    localStorage.setItem("collections", JSON.stringify(updatedCollections));
    setNewCollectionName("");
    setShowCollectionModal(false);
  };

  const handleViewCollection = (collectionName) => {
    if (selectedCollection?.name === collectionName) {
      setSelectedCollection(null);
    } else {
      const collection = collections.find((c) => c.name === collectionName);
      setSelectedCollection(collection);
    }
  };

  const handleDeleteFromCollection = (id) => {
    const updatedCollections = collections.map((collection) => {
      if (collection.name === selectedCollection.name) {
        const updatedShoes = collection.shoes.filter((shoe) => shoe.id !== id);
        return { ...collection, shoes: updatedShoes };
      }
      return collection;
    });

    setCollections(updatedCollections);
    localStorage.setItem("collections", JSON.stringify(updatedCollections));

    const updatedVault = vault.filter((shoe) => shoe.id !== id);
    setVault(updatedVault);
    localStorage.setItem("vault", JSON.stringify(updatedVault));

    const updatedSelectedCollection = updatedCollections.find((c) => c.name === selectedCollection.name);
    setSelectedCollection(updatedSelectedCollection);
  };

  const handleDeleteCollection = (collectionName) => {
    const updatedCollections = collections.filter((collection) => collection.name !== collectionName);
    setCollections(updatedCollections);
    localStorage.setItem("collections", JSON.stringify(updatedCollections));

    if (selectedCollection?.name === collectionName) {
      setSelectedCollection(null);
    }
  };

  const handleDeleteFromVault = (id) => {
    const updatedVault = vault.filter((shoe) => shoe.id !== id);
    setVault(updatedVault);
    localStorage.setItem("vault", JSON.stringify(updatedVault));

    const updatedCollections = collections.map((collection) => {
      const updatedShoes = collection.shoes.filter((shoe) => shoe.id !== id);
      return { ...collection, shoes: updatedShoes };
    });

    setCollections(updatedCollections);
    localStorage.setItem("collections", JSON.stringify(updatedCollections));
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
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 mb-4"
              onClick={() => setShowCollectionModal(true)}
            >
              Create New Collection
            </button>

            <h2 className="text-2xl font-bold mb-4">Shoes in Vault</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vault.map((shoe) => (
                <li
                  key={shoe.id}
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
                      onClick={() => handleDeleteFromVault(shoe.id)}
                    >
                      Delete from Vault
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold mb-4">My Collections</h2>
          {collections.length === 0 ? (
            <p className="text-center text-gray-500">No collections yet.</p>
          ) : (
            <div className="mb-12">
              <ul className="mb-6">
                {collections.map((collection) => (
                  <li key={collection.name} className="mb-2 flex items-center justify-between">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                      onClick={() => handleViewCollection(collection.name)}
                    >
                      {collection.name}
                    </button>
                    <button
                      className="ml-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
                      onClick={() => handleDeleteCollection(collection.name)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>

              {selectedCollection && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Collection: {selectedCollection.name}</h3>
                  {selectedCollection.shoes.length === 0 ? (
                    <p className="text-gray-500">No shoes in this collection.</p>
                  ) : (
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {selectedCollection.shoes.map((shoe) => (
                        <li
                          key={shoe.id}
                          className="p-4 border border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 transition hover:scale-105"
                        >
                          <h3 className="text-xl font-bold mb-2">{shoe.shoeName}</h3>
                          <p className="text-md mb-2">{shoe.brand}</p>
                          <img
                            className="w-full h-48 object-cover rounded-lg"
                            src={shoe.thumbnail}
                            alt={shoe.shoeName}
                          />
                          <button
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
                            onClick={() => handleDeleteFromCollection(shoe.id)}
                          >
                            Delete from Collection
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
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
                      checked={selectedShoe ? collection.shoes.some((shoe) => shoe.id === selectedShoe.id) : false}
                      onChange={(e) => handleCollectionChange(collection.name, e.target.checked)}
                    />
                    {collection.name}
                  </label>
                </div>
              ))}
              <input
                type="text"
                className="border border-gray-300 p-2 w-full mt-4"
                placeholder="New collection name"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
              />
              <button
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 w-full transition-colors duration-300"
                onClick={handleCreateNewCollection}
              >
                Create New Collection
              </button>
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