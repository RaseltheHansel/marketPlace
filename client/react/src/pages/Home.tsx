import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import type { ListingResponse } from '../types';
import ListingCard from '../components/ListingCard';
import SearchBar   from '../components/SearchBar';

export default function Home() {
  const [search,    setSearch]    = useState('');
  const [category,  setCategory]  = useState('');
  const [condition, setCondition] = useState('');
  const [page,      setPage]      = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['listings', search, category, condition, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search)    params.append('search',    search);
      if (category)  params.append('category',  category);
      if (condition) params.append('condition', condition);
      params.append('page', String(page));
      const res = await api.get<ListingResponse>('/listings?' + params.toString());
      return res.data;
    },
  });

  const handleClear = () => {
    setSearch(''); setCategory(''); setCondition(''); setPage(1);
  };

  return (
    <div className='max-w-6xl mx-auto px-4 py-8'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-900 mb-1'>Browse Items</h1>
        <p className='text-gray-500 text-sm'>Find great deals near you</p>
      </div>

      <SearchBar
        search={search} category={category} condition={condition}
        onSearch={(v) => { setSearch(v); setPage(1); }}
        onCategory={(v) => { setCategory(v); setPage(1); }}
        onCondition={(v) => { setCondition(v); setPage(1); }}
        onClear={handleClear}
      />

      {isLoading && (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className='bg-gray-100 rounded-xl h-64 animate-pulse' />
          ))}
        </div>
      )}

      {isError && <p className='text-center text-red-500 py-12'>Failed to load listings.</p>}

      {data && (
        <>
          <p className='text-sm text-gray-500 mb-4'>{data.total} items found</p>

          {data.listings.length === 0 ? (
            <p className='text-center text-gray-400 py-16 text-lg'>
              No items found. Try different filters.
            </p>
          ) : (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {data.listings.map(listing => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          )}

          {data.pages > 1 && (
            <div className='flex justify-center gap-2 mt-8'>
              {Array.from({ length: data.pages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors
                    ${page === p
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-200 hover:bg-gray-50'}`}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}