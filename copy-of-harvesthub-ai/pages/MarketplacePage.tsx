
import React, { useState, useEffect, useCallback } from 'react';
import { Produce } from '../types';
import { getAllProduce } from '../services/produceService';
import ProduceCard from '../components/ProduceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { PRODUCE_CATEGORIES } from '../constants';
import { SearchIcon, MapPinIcon, SproutIcon } from '../components/Icons';
import Input from '../components/Input';
import { Select } from '../components/Input'; // Assuming Select is exported from Input.tsx

const MarketplacePage: React.FC = () => {
  const [produceList, setProduceList] = useState<Produce[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [sortBy, setSortBy] = useState<'relevance' | 'distance' | 'freshness' | 'price_asc' | 'price_desc'>('relevance');

  const fetchMarketplaceProduce = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filters = {
        query: searchQuery || undefined,
        category: filterCategory || undefined,
        location: filterLocation || undefined,
      };
      let data = await getAllProduce(filters);

      // Client-side sorting for mock data
      if (sortBy === 'freshness') {
        data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else if (sortBy === 'price_asc') {
        data.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price_desc') {
        data.sort((a, b) => b.price - a.price);
      }
      // 'relevance' and 'distance' would typically be handled by backend search

      setProduceList(data);
    } catch (err) {
      setError("Failed to fetch produce from the marketplace. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, filterCategory, filterLocation, sortBy]);

  useEffect(() => {
    fetchMarketplaceProduce();
  }, [fetchMarketplaceProduce]);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      fetchMarketplaceProduce(); // Trigger fetch with current filters
  };

  const categoryOptions = [{ value: '', label: 'All Categories' }, ...PRODUCE_CATEGORIES.map(cat => ({ value: cat, label: cat }))];
  const sortOptions = [
    { value: 'relevance', label: 'Sort by Relevance' },
    { value: 'freshness', label: 'Sort by Newest First' },
    { value: 'price_asc', label: 'Sort by Price: Low to High' },
    { value: 'price_desc', label: 'Sort by Price: High to Low' },
    // { value: 'distance', label: 'Sort by Distance (Coming Soon)' }, // Example for future
  ];

  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-r from-secondary-light via-secondary to-secondary-dark p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-4xl font-bold text-white mb-3">Discover Fresh, Local Produce</h1>
        <p className="text-lg text-white mb-6">Find the best ingredients from farms near you and support your local community.</p>
        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto bg-white p-4 rounded-lg shadow-md flex items-center gap-2">
          <SearchIcon className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for fresh produce, farmers, or keywords (e.g., 'organic strawberries')"
            className="flex-grow p-2 border-none focus:ring-0 text-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
           <button type="submit" className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors">
            Search
          </button>
        </form>
      </section>

      {/* Filters Section */}
      <section className="p-6 bg-white shadow-md rounded-lg">
        <div className="grid md:grid-cols-3 gap-4 items-end">
          <Select
            label="Filter by Category"
            options={categoryOptions}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            selectClassName="py-2.5"
          />
          <Input
            label="Filter by Location/Distance"
            placeholder="e.g., Willow Creek or 95000"
            icon={<MapPinIcon className="text-gray-400" />}
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            inputClassName="py-2.5"
          />
          <Select
            label="Sort By"
            options={sortOptions}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            selectClassName="py-2.5"
          />
        </div>
         <div className="mt-4 text-right">
            <button onClick={fetchMarketplaceProduce} className="text-sm text-primary hover:underline">Apply Filters</button>
        </div>
      </section>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {isLoading ? (
        <LoadingSpinner fullScreen message="Fetching fresh produce..." />
      ) : produceList.length > 0 ? (
        <section className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {produceList.map(produce => (
            <ProduceCard key={produce.id} produce={produce} />
          ))}
        </section>
      ) : (
        <section className="text-center py-16 bg-white shadow rounded-lg">
          <SproutIcon className="w-24 h-24 text-gray-300 mx-auto mb-6"/>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Produce Found Matching Your Criteria</h2>
          <p className="text-gray-500 mb-6">
            Try adjusting your search terms or filters. Our farmers are adding new goodies all the time!
          </p>
          {/* Optionally, suggest popular categories or new listings */}
        </section>
      )}
    </div>
  );
};

export default MarketplacePage;
    