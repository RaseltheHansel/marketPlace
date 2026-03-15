import { Link } from 'react-router-dom';
import type { Listing } from '../types';

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link to={`/listings/${listing._id}`}
      style={{ background: '#2e2010', border: '1px solid #3d2d18', borderRadius: '14px', overflow: 'hidden', display: 'block', textDecoration: 'none', transition: 'transform 0.2s, border-color 0.2s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.borderColor = '#e85d26'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.borderColor = '#3d2d18'; }}>
      <img
        src={listing.images[0] || 'https://placehold.co/400x300?text=No+Image'}
        alt={listing.title}
        style={{ width: '100%', height: '140px', objectFit: 'cover', borderBottom: '1px solid #3d2d18' }}
      />
      <div style={{ padding: '12px' }}>
        <p style={{ fontSize: '13px', fontWeight: 500, color: '#f5ede0', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {listing.title}
        </p>
        <p style={{ fontFamily: 'Fraunces, serif', fontSize: '17px', fontWeight: 600, color: '#f0832f', marginBottom: '8px' }}>
          ₱{listing.price.toLocaleString()}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '10px', background: '#251a0e', border: '1px solid #3d2d18', color: '#c9a87a', padding: '3px 8px', borderRadius: '6px' }}>
            {listing.condition}
          </span>
          <span style={{ fontSize: '11px', color: '#8c7055' }}>{listing.location}</span>
        </div>
        <p style={{ fontSize: '11px', color: '#8c7055', marginTop: '6px' }}>
          {listing.seller?.name}
        </p>
      </div>
    </Link>
  );
}