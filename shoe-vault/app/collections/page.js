// app/collections/page.jsx
"use client";

import React, { useState, useEffect } from 'react';
//import ModalComponent from "../../components/ModalComponent";
import Navbar from "../../components/Navbar";

export default function Collections() {
  const [collections, setCollections] = useState([]);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [selectedShoe, setSelectedShoe] = useState(null);

  useEffect(() => {
    const storedCollections = JSON.parse(localStorage.getItem("collections")) || [];
    setCollections(storedCollections);
  }, []);

  const handleCreateNewCollection = () => {
    if (!newCollectionName.trim()) return;

    const newCollection = {
      name: newCollectionName,
      shoes: [],
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

  const handleDeleteCollection = (collectionName) => {
    const updatedCollections = collections.filter((collection) => collection.name !== collectionName);
    setCollections(updatedCollections);
    localStorage.setItem("collections", JSON.stringify(updatedCollections));

    if (selectedCollection?.name === collectionName) {
      setSelectedCollection(null);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6 max-w-4xl dark:bg-gray-900 dark:text-white">
        <h1 className="text-4xl font-extrabold mb-6 text-center">My Collections</h1>

        <button
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 mb-4"
          onClick={() => setShowCollectionModal(true)}
        >
          Create New Collection
        </button>

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
                        key={shoe.styleID}
                        className="p-4 border border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 transition hover:scale-105"
                      >
                        <h3 className="text-xl font-bold mb-2">{shoe.shoeName}</h3>
                        <p className="text-md mb-2">{shoe.brand}</p>
                        <img
                          className="w-full h-48 object-cover rounded-lg"
                          src={shoe.thumbnail}
                          alt={shoe.shoeName}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {showCollectionModal && (
        <ModalComponent
          open={showCollectionModal}
          handleClose={() => setShowCollectionModal(false)}
          title="Create New Collection"
          description={
            <div>
              <input
                type="text"
                className="border border-gray-300 p-2 w-full"
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
          }
        />
      )}
    </div>
  );
}
