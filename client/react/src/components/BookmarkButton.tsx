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
      title={bookmarked ? 'Remove bookmark' : 'Save item'}
      style={{
        background: bookmarked ? 'rgba(212,168,67,0.15)' : '#251a0e',
        border: `1px solid ${bookmarked ? '#d4a843' : '#3d2d18'}`,
        borderRadius: '10px',
        padding: '8px 14px',
        fontSize: '20px',
        color: bookmarked ? '#d4a843' : '#8c7055',
        cursor: mutation.isPending ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        flexShrink: 0,
      }}>
      ★
    </button>
  );
}