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
    <div className='max-w-5xl mx-auto px-4 py-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='bg-gray-100 rounded-2xl h-80 animate-pulse' />
        <div className='space-y-4'>
          <div className='bg-gray-100 rounded h-8 animate-pulse' />
          <div className='bg-gray-100 rounded h-6 w-32 animate-pulse' />
        </div>
      </div>
    </div>
  );

  if (!listing) return <p className='text-center py-12 text-gray-500'>Listing not found.</p>;

  const isSeller = userId === listing.seller._id;

  return (
    <div className='max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8'>
      {/* Images */}
      <div>
        <img
          src={listing.images[imgIdx] || 'https://placehold.co/800x600?text=No+Image'}
          alt={listing.title}
          className='w-full h-80 object-cover rounded-2xl mb-3'
        />
        {listing.images.length > 1 && (
          <div className='flex gap-2 flex-wrap'>
            {listing.images.map((img, i) => (
              <img key={i} src={img} onClick={() => setImgIdx(i)}
                className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 transition-all
                  ${i === imgIdx ? 'border-blue-500' : 'border-transparent hover:border-gray-300'}`} />
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div>
        <div className='flex items-start justify-between mb-3'>
          <h1 className='text-2xl font-bold text-gray-900 leading-tight pr-3'>
            {listing.title}
          </h1>
          <BookmarkButton listingId={listing._id} />
        </div>
        <p className='text-3xl font-bold text-blue-600 mb-4'>
          ₱{listing.price.toLocaleString()}
        </p>
        <div className='flex gap-2 flex-wrap mb-4'>
          <span className='text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium'>
            {listing.category}
          </span>
          <span className='text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium'>
            {listing.condition}
          </span>
          <span className='text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full'>
            📍 {listing.location}
          </span>
        </div>
        <p className='text-gray-600 text-sm leading-relaxed mb-4'>{listing.description}</p>
        <div className='flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-xl'>
          <div className='w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm'>
            {listing.seller.name[0].toUpperCase()}
          </div>
          <div>
            <p className='text-sm font-semibold text-gray-900'>{listing.seller.name}</p>
            <p className='text-xs text-gray-400'>{listing.views} views</p>
          </div>
        </div>

        {userId && !isSeller && (
          <ChatBox
            listingId={listing._id}
            sellerId={listing.seller._id}
            userId={userId}
          />
        )}
        {!userId && (
          <div className='bg-blue-50 border border-blue-100 rounded-xl p-4 text-center'>
            <p className='text-sm text-blue-700'>
              <a href='/login' className='font-medium underline'>Login</a> to chat with the seller
            </p>
          </div>
        )}
        {isSeller && (
          <div className='bg-gray-50 border border-gray-200 rounded-xl p-4 text-center'>
            <p className='text-sm text-gray-500'>This is your listing</p>
          </div>
        )}
      </div>
    </div>
  );
}