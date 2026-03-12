import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import type { ListingResponse } from '../types';

const CATEGORIES = ['Electronics','Clothing','Furniture','Books','Vehicles','Sports','Toys','Food','Other'];
const CONDITIONS  = ['new','like-new','good','fair','poor'];

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

  const inp = 'border border-gray-300 p-2 rounded-lg text-sm outline-none focus:border-blue-500 bg-white';

  return (
    <div className='max-w-6xl mx-auto px-4 py-8'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-900 mb-1'>Browse Items</h1>
        <p className='text-gray-500 text-sm'>Find great deals near you</p>
      </div>

      {/* Search and Filters */}
      <div className='flex gap-3 mb-6 flex-wrap'>
        <input type='text' placeholder='Search items...' value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className={inp + ' flex-1 min-w-48'} />
        <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }} className={inp}>
          <option value=''>All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={condition} onChange={e => { setCondition(e.target.value); setPage(1); }} className={inp}>
          <option value=''>Any Condition</option>
          {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={() => { setSearch(''); setCategory(''); setCondition(''); setPage(1); }}
          className='text-sm text-blue-600 hover:text-blue-800 font-medium px-3'>
          Clear
        </button>
      </div>

      {/* Loading skeleton */}
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
                <Link key={listing._id} to={`/listings/${listing._id}`}
                  className='bg-white border border-gray-200 rounded-xl overflow-hidden
                    hover:shadow-lg hover:-translate-y-1 transition-all block'>
                  <img
                    src={listing.images[0] || 'https://placehold.co/400x300?text=No+Image'}
                    alt={listing.title}
                    className='w-full h-44 object-cover'
                  />
                  <div className='p-3'>
                    <p className='font-semibold text-gray-900 text-sm truncate'>{listing.title}</p>
                    <p className='text-blue-600 font-bold mt-1'>₱{listing.price.toLocaleString()}</p>
                    <div className='flex items-center justify-between mt-2'>
                      <span className='text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full'>
                        {listing.condition}
                      </span>
                      <span className='text-xs text-gray-400 truncate ml-2'>{listing.location}</span>
                    </div>
                    <p className='text-xs text-gray-400 mt-1 truncate'>{listing.seller?.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
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