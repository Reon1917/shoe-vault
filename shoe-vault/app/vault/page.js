"use client";
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';

export default function Vault() {
  const [vault, setVault] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedShoe, setSelectedShoe] = useState(null);

  useEffect(() => {
    const storedVault = JSON.parse(localStorage.getItem('vault')) || [];
    setVault(storedVault);
  }, []);

  const handleDelete = (styleID) => {
    setSelectedShoe(styleID);
    setShowConfirm(true);
  };

  const handleConfirm = (confirm) => {
    if (confirm && selectedShoe !== null) {
      const updatedVault = vault.filter(shoe => shoe.styleID !== selectedShoe);
      setVault(updatedVault);
      localStorage.setItem('vault', JSON.stringify(updatedVault));
    }
    setShowConfirm(false);
    setSelectedShoe(null);
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6 max-w-4xl dark:bg-gray-900 dark:text-white">
        <h1 className="text-4xl font-extrabold mb-6 text-center">My Vault</h1>
        {vault.length === 0 ? (
          <p className="text-center text-gray-500">No shoes in the vault yet.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vault.map((shoe) => (
              <li key={shoe.styleID} className="p-4 border border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-2">{shoe.shoeName}</h2>
                <p className="text-lg mb-2">{shoe.brand}</p>
                <img className="w-full h-48 object-cover rounded-lg" src={shoe.thumbnail} alt={shoe.shoeName} />
                <button 
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
                  onClick={() => handleDelete(shoe.styleID)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="mb-4">Are you sure?</p>
            <button 
              className="mr-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
              onClick={() => handleConfirm(true)}
            >
              Yes
            </button>
            <button 
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700"
              onClick={() => handleConfirm(false)}
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}