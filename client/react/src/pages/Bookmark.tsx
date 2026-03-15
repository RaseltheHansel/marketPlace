import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import type { Listing } from '../types';
import ListingCard from '../components/ListingCard';

interface BookmarkItem {
  _id:     string;
  listing: Listing;
}

export default function Bookmarks() {
  const qc = useQueryClient();

  const { data: bookmarks, isLoading } = useQuery({
    queryKey: ['bookmarks'],
    queryFn:  async () => {
      const r = await api.get<BookmarkItem[]>('/bookmarks');
      return r.data;
    },
  });

  const validBookmarks = bookmarks?.filter(b => b.listing) ?? [];

  const removeMutation = useMutation({
    mutationFn: (listingId: string) => api.post(`/bookmarks/${listingId}`),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['bookmarks'] }),
  });

  return (
    <div style={{ background: '#1c1209', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <p style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#e85d26', fontWeight: 500, marginBottom: '6px' }}>
            Your collection
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '30px', color: '#f5ede0' }}>
              Saved Items
            </h1>
            {validBookmarks.length > 0 && (
              <span style={{ background: '#2e2010', border: '1px solid #3d2d18', color: '#8c7055', padding: '6px 14px', borderRadius: '20px', fontSize: '13px' }}>
                {validBookmarks.length} {validBookmarks.length === 1 ? 'item' : 'items'} saved
              </span>
            )}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ background: '#2e2010', border: '1px solid #3d2d18', borderRadius: '14px', height: '240px', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && validBookmarks.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 24px', background: '#2e2010', border: '1px solid #3d2d18', borderRadius: '20px' }}>
            <p style={{ fontSize: '56px', marginBottom: '16px' }}>★</p>
            <p style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', color: '#f5ede0', marginBottom: '8px' }}>
              Nothing saved yet
            </p>
            <p style={{ fontSize: '14px', color: '#8c7055', marginBottom: '24px' }}>
              Browse listings and click ★ to save items you like
            </p>
            <a href='/'
              style={{ background: '#e85d26', color: '#fff', padding: '12px 28px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
              Browse listings
            </a>
          </div>
        )}

        {/* Grid */}
        {validBookmarks.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {validBookmarks.map(b => (
              <div key={b._id} style={{ position: 'relative' }}
                onMouseEnter={e => {
                  const btn = e.currentTarget.querySelector('.remove-btn') as HTMLElement;
                  if (btn) btn.style.opacity = '1';
                }}
                onMouseLeave={e => {
                  const btn = e.currentTarget.querySelector('.remove-btn') as HTMLElement;
                  if (btn) btn.style.opacity = '0';
                }}>
                <ListingCard listing={b.listing} />
                <button
                  className='remove-btn'
                  onClick={() => removeMutation.mutate(b.listing._id)}
                  style={{
                    position: 'absolute', top: '8px', right: '8px',
                    background: 'rgba(28,18,9,0.85)',
                    border: '1px solid #d4a843',
                    borderRadius: '8px',
                    width: '32px', height: '32px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#d4a843', fontSize: '16px',
                    cursor: 'pointer', opacity: '0',
                    transition: 'opacity 0.2s',
                  }}>
                  ★
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}