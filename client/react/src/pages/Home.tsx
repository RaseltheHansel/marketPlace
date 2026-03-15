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
    <div style={{ background: '#1c1209', minHeight: '100vh' }}>

      {/* HERO */}
      <div style={{ background: '#251a0e', borderBottom: '1px solid #3d2d18' }}
        className='px-6 py-10 relative overflow-hidden'>
        {/* Decorative glow */}
        <div style={{
          position: 'absolute', right: '-60px', top: '-60px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,93,38,0.10) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <p style={{ color: '#e85d26', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 500, marginBottom: '8px' }}>
          Second-hand marketplace
        </p>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '36px', color: '#f5ede0', lineHeight: 1.2, marginBottom: '8px' }}>
          Buy & sell <em style={{ color: '#e85d26', fontStyle: 'italic' }}>anything</em><br />near you
        </h1>
        <p style={{ color: '#8c7055', fontSize: '14px', marginBottom: '24px' }}>
          Thousands of items from trusted sellers across the Philippines
        </p>

        {/* Search */}
        <SearchBar
          search={search} category={category} condition={condition}
          onSearch={(v) => { setSearch(v); setPage(1); }}
          onCategory={(v) => { setCategory(v); setPage(1); }}
          onCondition={(v) => { setCondition(v); setPage(1); }}
          onClear={handleClear}
        />
      </div>

      {/* STATS ROW */}
      <div style={{ borderBottom: '1px solid #3d2d18', display: 'flex' }}>
        {[
          { num: '2,400+', label: 'Active listings' },
          { num: '840+',   label: 'Sellers' },
          { num: '9',      label: 'Categories' },
          { num: '24h',    label: 'Avg. response' },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, padding: '14px 20px', borderRight: i < 3 ? '1px solid #3d2d18' : 'none', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', color: '#f0832f', fontWeight: 600 }}>{s.num}</div>
            <div style={{ fontSize: '11px', color: '#8c7055', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* CATEGORY PILLS */}
      <div style={{ borderBottom: '1px solid #3d2d18', padding: '16px 24px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { label: 'All',         val: '' },
          { label: '📱 Electronics', val: 'Electronics' },
          { label: '👕 Clothing',    val: 'Clothing' },
          { label: '🪑 Furniture',   val: 'Furniture' },
          { label: '📚 Books',       val: 'Books' },
          { label: '🚗 Vehicles',    val: 'Vehicles' },
          { label: '⚽ Sports',      val: 'Sports' },
          { label: '🧸 Toys',        val: 'Toys' },
          { label: '🍱 Food',        val: 'Food' },
          { label: '📦 Other',       val: 'Other' },
        ].map(c => (
          <button key={c.val} onClick={() => { setCategory(c.val); setPage(1); }}
            style={{
              background: category === c.val ? '#e85d26' : '#2e2010',
              border: `1px solid ${category === c.val ? '#e85d26' : '#3d2d18'}`,
              color: category === c.val ? '#fff' : '#8c7055',
              padding: '6px 14px', borderRadius: '20px', fontSize: '12px',
              cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
              fontWeight: category === c.val ? 500 : 400,
              transition: 'all 0.2s',
            }}>
            {c.label}
          </button>
        ))}
      </div>

      {/* LISTINGS */}
      <div className='max-w-6xl mx-auto px-6 py-6'>
        <div className='flex items-center justify-between mb-5'>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', color: '#f5ede0' }}>
            Recent listings
          </h2>
          {data && (
            <span style={{ background: '#2e2010', border: '1px solid #3d2d18', color: '#8c7055', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>
              {data.total} items found
            </span>
          )}
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ background: '#2e2010', border: '1px solid #3d2d18', borderRadius: '14px', height: '220px', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        )}

        {isError && (
          <p className='text-center py-12' style={{ color: '#e85d26' }}>
            Failed to load listings.
          </p>
        )}

        {data && (
          <>
            {data.listings.length === 0 ? (
              <div className='text-center py-16'>
                <p style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</p>
                <p style={{ color: '#8c7055', fontSize: '16px' }}>No items found. Try different filters.</p>
              </div>
            ) : (
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {data.listings.map(listing => (
                  <ListingCard key={listing._id} listing={listing} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {data.pages > 1 && (
              <div className='flex justify-center gap-2 mt-8'>
                {Array.from({ length: data.pages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    style={{
                      width: '36px', height: '36px', borderRadius: '8px', fontSize: '13px',
                      background: page === p ? '#e85d26' : '#2e2010',
                      border: `1px solid ${page === p ? '#e85d26' : '#3d2d18'}`,
                      color: page === p ? '#fff' : '#8c7055',
                      cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                    }}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}