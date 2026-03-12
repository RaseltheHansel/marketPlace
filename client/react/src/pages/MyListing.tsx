import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import type { Listing } from '../types';

const statusColor: Record<string, string> = {
  pending:  'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
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

  return (
    <div className='max-w-4xl mx-auto px-4 py-8'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>My Listings</h1>
        <Link to='/create'
          className='bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700'>
          + Post New Item
        </Link>
      </div>
      {isLoading && <p className='text-gray-400 text-center py-8'>Loading...</p>}
      {listings?.length === 0 && (
        <div className='text-center py-16'>
          <p className='text-gray-400 text-lg mb-4'>No listings yet</p>
          <Link to='/create' className='text-blue-600 hover:underline'>Post your first item</Link>
        </div>
      )}
      <div className='space-y-4'>
        {listings?.map(listing => (
          <div key={listing._id}
            className='bg-white border border-gray-200 rounded-xl p-4 flex gap-4'>
            <img
              src={listing.images[0] || 'https://placehold.co/100x100?text=No+Image'}
              alt={listing.title}
              className='w-24 h-24 object-cover rounded-lg shrink-0'
            />
            <div className='flex-1 min-w-0'>
              <div className='flex items-start justify-between gap-2'>
                <p className='font-semibold text-gray-900 truncate'>{listing.title}</p>
                <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0
                  ${statusColor[listing.status]}`}>
                  {listing.status}
                </span>
              </div>
              <p className='text-blue-600 font-bold mt-1'>₱{listing.price.toLocaleString()}</p>
              <p className='text-sm text-gray-500'>{listing.location} · {listing.condition}</p>
              <p className='text-xs text-gray-400 mt-1'>{listing.views} views</p>
            </div>
            <div className='flex flex-col gap-2 shrink-0'>
              <Link to={`/listings/${listing._id}`}
                className='text-xs text-blue-600 hover:underline text-center'>
                View
              </Link>
              <button
                onClick={() => {
                  if (confirm('Delete this listing?')) deleteMutation.mutate(listing._id);
                }}
                className='text-xs text-red-500 hover:text-red-700'>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}