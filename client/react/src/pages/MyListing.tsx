import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import type { Listing } from '../types';

const statusConfig: Record<string, { bg: string; border: string; color: string; label: string }> = {
  pending:  { bg: 'rgba(212,168,67,0.1)',  border: '#d4a843', color: '#d4a843', label: '⏳ Pending' },
  approved: { bg: 'rgba(76,175,80,0.1)',   border: '#4caf50', color: '#4caf50', label: '✓ Approved' },
  rejected: { bg: 'rgba(232,93,38,0.1)',   border: '#e85d26', color: '#e85d26', label: '✗ Rejected' },
};

export default function MyListings() {
  const qc = useQueryClient();

  const { data: listings, isLoading } = useQuery({
    queryKey: ['my-listings'],
    queryFn:  async () => {
      const r = await api.get<Listing[]>('/listings/my');
      return r.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/listings/${id}`),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['my-listings'] }),
  });

  const approved = listings?.filter(l => l.status === 'approved').length ?? 0;
  const pending  = listings?.filter(l => l.status === 'pending').length ?? 0;
  const rejected = listings?.filter(l => l.status === 'rejected').length ?? 0;

  return (
    <div style={{ background: '#1c1209', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <p style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#e85d26', fontWeight: 500, marginBottom: '6px' }}>
              Seller dashboard
            </p>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '30px', color: '#f5ede0' }}>
              My Listings
            </h1>
          </div>
          <Link to='/create'
            style={{ background: '#e85d26', color: '#fff', padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', fontFamily: 'Outfit, sans-serif' }}>
            + Post New Item
          </Link>
        </div>

        {/* Stats */}
        {listings && listings.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
            {[
              { num: approved, label: 'Approved',  color: '#4caf50' },
              { num: pending,  label: 'Pending',   color: '#d4a843' },
              { num: rejected, label: 'Rejected',  color: '#e85d26' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#2e2010', border: '1px solid #3d2d18', borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '28px', fontWeight: 600, color: s.color }}>
                  {s.num}
                </div>
                <div style={{ fontSize: '12px', color: '#8c7055', marginTop: '2px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ background: '#2e2010', border: '1px solid #3d2d18', borderRadius: '14px', height: '100px', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && listings?.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 24px', background: '#2e2010', border: '1px solid #3d2d18', borderRadius: '20px' }}>
            <p style={{ fontSize: '48px', marginBottom: '12px' }}>📦</p>
            <p style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', color: '#f5ede0', marginBottom: '8px' }}>No listings yet</p>
            <p style={{ fontSize: '14px', color: '#8c7055', marginBottom: '24px' }}>
              Start selling by posting your first item
            </p>
            <Link to='/create'
              style={{ background: '#e85d26', color: '#fff', padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
              Post your first item
            </Link>
          </div>
        )}

        {/* Listings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {listings?.map(listing => {
            const s = statusConfig[listing.status] ?? statusConfig.pending;
            return (
              <div key={listing._id}
                style={{ background: '#2e2010', border: '1px solid #3d2d18', borderRadius: '16px', padding: '16px', display: 'flex', gap: '16px', alignItems: 'center', transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#e85d26')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#3d2d18')}>

                {/* Image */}
                <img
                  src={listing.images[0] || 'https://placehold.co/100x100?text=No+Image'}
                  alt={listing.title}
                  style={{ width: '88px', height: '88px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #3d2d18', flexShrink: 0 }}
                />

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                    <p style={{ fontSize: '15px', fontWeight: 500, color: '#f5ede0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {listing.title}
                    </p>
                    <span style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color, fontSize: '11px', padding: '3px 10px', borderRadius: '20px', flexShrink: 0, fontWeight: 500 }}>
                      {s.label}
                    </span>
                  </div>
                  <p style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: 600, color: '#f0832f', marginBottom: '4px' }}>
                    ₱{listing.price.toLocaleString()}
                  </p>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span style={{ fontSize: '12px', color: '#8c7055' }}>📍 {listing.location}</span>
                    <span style={{ fontSize: '12px', color: '#8c7055' }}>· {listing.condition}</span>
                    <span style={{ fontSize: '12px', color: '#8c7055' }}>· 👁 {listing.views} views</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                  <Link to={`/listings/${listing._id}`}
                    style={{ background: '#251a0e', border: '1px solid #3d2d18', color: '#f0832f', padding: '7px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, textDecoration: 'none', textAlign: 'center' }}>
                    View
                  </Link>
                  <button
                    onClick={() => { if (confirm('Delete this listing?')) deleteMutation.mutate(listing._id); }}
                    style={{ background: 'rgba(232,93,38,0.1)', border: '1px solid rgba(232,93,38,0.3)', color: '#e85d26', padding: '7px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}