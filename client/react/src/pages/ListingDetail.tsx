import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import type { Listing } from '../types';
import BookmarkButton from '../components/BookmarkButton';
import ChatBox        from '../components/ChatBox';

export default function ListingDetail() {
  const { id }   = useParams<{ id: string }>();
  const [imgIdx, setImgIdx] = useState(0);
  const user     = JSON.parse(localStorage.getItem('user') || '{}');
  const userId   = user._id;

  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing', id],
    queryFn:  async () => {
      const r = await api.get<Listing>(`/listings/${id}`);
      return r.data;
    },
  });

  if (isLoading) return (
    <div style={{ background: '#1c1209', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <div style={{ background: '#2e2010', borderRadius: '16px', height: '320px', animation: 'pulse 1.5s infinite' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#2e2010', borderRadius: '8px', height: '32px', animation: 'pulse 1.5s infinite' }} />
          <div style={{ background: '#2e2010', borderRadius: '8px', height: '24px', width: '40%', animation: 'pulse 1.5s infinite' }} />
        </div>
      </div>
    </div>
  );

  if (!listing) return (
    <div style={{ background: '#1c1209', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#8c7055', fontSize: '18px' }}>Listing not found.</p>
    </div>
  );

  const isSeller = userId === listing.seller._id;

  return (
    <div style={{ background: '#1c1209', minHeight: '100vh' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Breadcrumb */}
        <p style={{ fontSize: '12px', color: '#8c7055', marginBottom: '24px' }}>
          <span style={{ cursor: 'pointer', color: '#f0832f' }} onClick={() => history.back()}>← Back to listings</span>
          {' '} · {listing.category}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>

          {/* LEFT — Images */}
          <div>
            <div style={{ position: 'relative' }}>
              <img
                src={listing.images[imgIdx] || 'https://placehold.co/800x600?text=No+Image'}
                alt={listing.title}
                style={{ width: '100%', height: '320px', objectFit: 'cover', borderRadius: '16px', border: '1px solid #3d2d18' }}
              />
              {/* Image counter */}
              {listing.images.length > 1 && (
                <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(28,18,9,0.8)', color: '#c9a87a', fontSize: '11px', padding: '4px 10px', borderRadius: '20px', border: '1px solid #3d2d18' }}>
                  {imgIdx + 1} / {listing.images.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {listing.images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                {listing.images.map((img, i) => (
                  <img key={i} src={img} onClick={() => setImgIdx(i)}
                    style={{
                      width: '60px', height: '60px', objectFit: 'cover',
                      borderRadius: '10px', cursor: 'pointer',
                      border: `2px solid ${i === imgIdx ? '#e85d26' : '#3d2d18'}`,
                      transition: 'border-color 0.2s',
                    }} />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Category label */}
            <p style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#e85d26', fontWeight: 500 }}>
              {listing.category} · {listing.views} views
            </p>

            {/* Title + Bookmark */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
              <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '26px', color: '#f5ede0', lineHeight: 1.3 }}>
                {listing.title}
              </h1>
              <BookmarkButton listingId={listing._id} />
            </div>

            {/* Price */}
            <p style={{ fontFamily: 'Fraunces, serif', fontSize: '36px', fontWeight: 600, color: '#e85d26', lineHeight: 1 }}>
              ₱{listing.price.toLocaleString()}
            </p>

            {/* Tags */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', padding: '5px 12px', borderRadius: '6px', background: 'rgba(232,93,38,0.15)', border: '1px solid #e85d26', color: '#f0832f' }}>
                {listing.condition}
              </span>
              <span style={{ fontSize: '11px', padding: '5px 12px', borderRadius: '6px', background: '#251a0e', border: '1px solid #3d2d18', color: '#c9a87a' }}>
                📍 {listing.location}
              </span>
              <span style={{ fontSize: '11px', padding: '5px 12px', borderRadius: '6px', background: '#251a0e', border: '1px solid #3d2d18', color: '#c9a87a' }}>
                {listing.category}
              </span>
            </div>

            {/* Description */}
            <div style={{ background: '#251a0e', border: '1px solid #3d2d18', borderRadius: '12px', padding: '16px' }}>
              <p style={{ fontSize: '11px', color: '#8c7055', marginBottom: '8px', letterSpacing: '1px', textTransform: 'uppercase' }}>Description</p>
              <p style={{ fontSize: '14px', color: '#c9a87a', lineHeight: 1.8 }}>
                {listing.description}
              </p>
            </div>

            {/* Seller */}
            <div style={{ background: '#251a0e', border: '1px solid #3d2d18', borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', background: 'rgba(232,93,38,0.2)', border: '1px solid #e85d26', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 600, color: '#f0832f', flexShrink: 0 }}>
                {listing.seller.name[0].toUpperCase()}
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 500, color: '#f5ede0' }}>{listing.seller.name}</p>
                <p style={{ fontSize: '12px', color: '#8c7055' }}>{listing.views} views on this listing</p>
              </div>
            </div>

            {/* Chat / Login prompt / Your listing */}
            {userId && !isSeller && (
              <ChatBox
                listingId={listing._id}
                sellerId={listing.seller._id}
                userId={userId}
              />
            )}
            {!userId && (
              <div style={{ background: '#251a0e', border: '1px solid #3d2d18', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: '#8c7055' }}>
                  <a href='/login' style={{ color: '#f0832f', fontWeight: 500 }}>Login</a>
                  {' '}to chat with the seller
                </p>
              </div>
            )}
            {isSeller && (
              <div style={{ background: '#251a0e', border: '1px solid #3d2d18', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: '#8c7055' }}>✓ This is your listing</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}