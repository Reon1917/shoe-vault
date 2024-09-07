"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

export default function SneakerDetail() {
  const [sneaker, setSneaker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { styleID } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!styleID) return;

    async function fetchSneaker() {
      try {
        const response = await fetch(`/api/sneaks/${styleID}`);
        const data = await response.json();
        if (response.ok) {
          setSneaker(data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSneaker();
  }, [styleID]);

  const addToVault = (shoe) => {
    const storedVault = JSON.parse(localStorage.getItem('vault')) || [];
    storedVault.push(shoe);
    localStorage.setItem('vault', JSON.stringify(storedVault));
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6 max-w-4xl dark:bg-gray-900 dark:text-white">
        <button onClick={() => router.back()} className="mb-4 text-blue-500 hover:text-blue-700">
          ← Back to Search
        </button>
        <h1 className="text-4xl font-extrabold mb-4 text-center">{sneaker.shoeName}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col items-center space-y-4">
            <img className="w-full rounded-lg shadow-lg object-cover" src={sneaker.thumbnail} alt={sneaker.shoeName} />
            <div className="text-lg text-gray-600 dark:text-gray-400">
              <p><span className="font-semibold">Brand:</span> {sneaker.brand}</p>
              <p><span className="font-semibold">Silhouette:</span> {sneaker.silhouette}</p>
              <p><span className="font-semibold">Colorway:</span> {sneaker.colorway}</p>
              <p><span className="font-semibold">Retail Price:</span> ${sneaker.retailPrice}</p>
              <p><span className="font-semibold">Release Date:</span> {sneaker.releaseDate}</p>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-lg">{sneaker.description}</p>
            {sneaker.lowestResellPrice && (
              <>
                <h2 className="text-2xl font-semibold mb-2">Lowest Resell Prices</h2>
                <ul className="list-disc list-inside mb-4">
                  {Object.entries(sneaker.lowestResellPrice).map(([marketplace, price]) => (
                    <li key={marketplace}>{marketplace}: ${price}</li>
                  ))}
                </ul>
              </>
            )}
            {sneaker.resellLinks && (
              <>
                <h2 className="text-2xl font-semibold mb-2">Resell Links</h2>
                <ul className="list-disc list-inside mb-4">
                  {Object.entries(sneaker.resellLinks).map(([marketplace, link]) => (
                    <li key={marketplace}>
                      <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {marketplace}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {sneaker.imageLinks && sneaker.imageLinks.length > 0 && (
              <>
                <h2 className="text-2xl font-semibold mb-2">Images</h2>
                <div className="grid grid-cols-2 gap-4">
                  {sneaker.imageLinks.map((image, index) => (
                    <img key={index} className="w-full h-auto object-cover" src={image} alt={`${sneaker.shoeName} ${index + 1}`} />
                  ))}
                </div>
              </>
            )}
            <button
            onClick={() => addToVault(sneaker)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 active:scale-95 transition-transform duration-150"
          >
            Add to Vault
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}