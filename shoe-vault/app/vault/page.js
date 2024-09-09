"use client";
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';

export default function Vault() {
  const [vault, setVault] = useState([]);

  useEffect(() => {
    const storedVault = JSON.parse(localStorage.getItem('vault')) || [];
    setVault(storedVault);
  }, []);

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
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}