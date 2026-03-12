import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '../api/axios';

export default function BookmarkButton({ listingId }: { listingId: string }) {
  const [bookmarked, setBookmarked] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;
    api.get<{ bookmarked: boolean }>(`/bookmarks/${listingId}/check`)
      .then(r => setBookmarked(r.data.bookmarked))
      .catch(() => {});
  }, [listingId, token]);

  const mutation = useMutation({
    mutationFn: () => api.post(`/bookmarks/${listingId}`),
    onSuccess: () => setBookmarked(prev => !prev),
  });

  if (!token) return null;

  return (
    <button
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      className={`text-3xl transition-all hover:scale-110 active:scale-95
        ${bookmarked ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`}
      title={bookmarked ? 'Remove bookmark' : 'Save item'}
    >
      ★
    </button>
  );
}