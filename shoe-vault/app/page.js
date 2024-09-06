"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [keyword, setKeyword] = useState('');
  const [sneakers, setSneakers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/sneaks?keyword=${keyword}`);
      const data = await response.json();
      if (response.ok) {
        setSneakers(data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShoeClick = (styleID) => {
    router.push(`/sneaks/${styleID}`);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl dark:bg-gray-900 dark:text-white">
      <h1 className="text-4xl font-extrabold mb-6 text-center">Sneaker Search</h1>
      <form onSubmit={handleSearch} className="flex flex-col items-center mb-6">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search for sneakers..."
          className="w-full md:w-1/2 p-2 mb-4 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700">
          Search
        </button>
      </form>
      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sneakers.map((sneaker) => (
          <li
            key={sneaker.styleID}
            onClick={() => handleShoeClick(sneaker.styleID)}
            className="cursor-pointer p-4 border border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700"
          >
            <h2 className="text-2xl font-bold mb-2">{sneaker.shoeName}</h2>
            <p className="text-lg mb-2">{sneaker.brand}</p>
            <img className="w-full h-48 object-cover rounded-lg" src={sneaker.thumbnail} alt={sneaker.shoeName} />
          </li>
        ))}
      </ul>
    </div>
  );
}