import { Link } from 'react-router-dom';
import type { Listing } from '../types';

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link to={`/listings/${listing._id}`}
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
  );
}