"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function SneakerDetail() {
  const router = useRouter();
  const [sneaker, setSneaker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { styleID } = useParams();

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

  if (loading) return <p className="text-center text-black">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
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
        <div className="space-y-6">
          <p className="text-lg leading-relaxed dark:text-gray-300">{sneaker.description}</p>
          {sneaker.priceMap && (
            <div>
              <h2 className="text-2xl font-semibold mb-2">Prices</h2>
              <ul className="list-disc list-inside space-y-1 dark:text-gray-300">
                {Object.entries(sneaker.priceMap).map(([marketplace, price]) => (
                  <li key={marketplace} className="text-lg">{marketplace}: ${price}</li>
                ))}
              </ul>
            </div>
          )}
          {sneaker.images && (
            <div>
              <h2 className="text-2xl font-semibold mb-2">Images</h2>
              <div className="grid grid-cols-2 gap-4">
                {sneaker.images.map((image, index) => (
                  <img key={index} className="w-full rounded-lg shadow-md object-cover" src={image} alt={`${sneaker.shoeName} ${index + 1}`} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
