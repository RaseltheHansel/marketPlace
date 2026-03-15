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
    <div className='max-w-6xl mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold text-gray-900 mb-6'>
        ★ Saved Items ({validBookmarks   .length})
      </h1>
      {isLoading && <p className='text-gray-400 text-center py-8'>Loading...</p>}
      {bookmarks?.length === 0 && (
        <p className='text-center text-gray-400 py-16 text-lg'>
          No saved items yet. Browse listings and click ★ to save!
        </p>
      )}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {validBookmarks.map(b => (
          <div key={b._id} className='relative group'>
            <ListingCard listing={b.listing} />
            <button
              onClick={() => removeMutation.mutate(b.listing._id)}
              className='absolute top-2 right-2 bg-white rounded-full w-7 h-7
                flex items-center justify-center text-yellow-400 shadow
                hover:text-gray-300 transition-colors opacity-0 group-hover:opacity-100'>
              ★
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
