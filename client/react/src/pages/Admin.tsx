    import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../api/axios';
import type { Listing, User } from '../types';

type Tab = 'listings' | 'users';

export default function Admin() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>('listings');

  const { data: pending } = useQuery({
    queryKey: ['admin-pending'],
    queryFn:  async () => {
      const r = await api.get<Listing[]>('/admin/listings/pending');
      return r.data;
    },
  });

  const { data: users } = useQuery({
    queryKey: ['admin-users'],
    enabled:  tab === 'users',
    queryFn:  async () => {
      const r = await api.get<User[]>('/admin/users');
      return r.data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/admin/listings/${id}/status`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-pending'] }),
  });

  const tabCls = (t: Tab) => `px-4 py-2 text-sm font-medium rounded-lg transition-colors
    ${tab === t ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`;

  return (
    <div className='max-w-5xl mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold text-gray-900 mb-6'>Admin Dashboard</h1>
      <div className='flex gap-2 mb-6'>
        <button className={tabCls('listings')} onClick={() => setTab('listings')}>
          Pending Listings ({pending?.length ?? 0})
        </button>
        <button className={tabCls('users')} onClick={() => setTab('users')}>
          All Users
        </button>
      </div>

      {tab === 'listings' && (
        <div className='space-y-4'>
          {pending?.length === 0 && (
            <p className='text-center text-gray-400 py-12 text-lg'>
              🎉 No pending listings!
            </p>
          )}
          {pending?.map(listing => (
            <div key={listing._id}
              className='bg-white border border-gray-200 rounded-xl p-4 flex gap-4'>
              <img
                src={listing.images[0] || 'https://placehold.co/100x100'}
                alt={listing.title}
                className='w-24 h-24 object-cover rounded-lg shrink-0'
              />
              <div className='flex-1 min-w-0'>
                <p className='font-semibold text-gray-900'>{listing.title}</p>
                <p className='text-blue-600 font-bold'>₱{listing.price.toLocaleString()}</p>
                <p className='text-sm text-gray-500'>
                  {listing.location} · {listing.condition} · {listing.category}
                </p>
                <p className='text-sm text-gray-400 mt-1 line-clamp-2'>{listing.description}</p>
                <p className='text-xs text-gray-400 mt-1'>Seller: {listing.seller?.name}</p>
              </div>
              <div className='flex flex-col gap-2 shrink-0'>
                <button
                  onClick={() => statusMutation.mutate({ id: listing._id, status: 'approved' })}
                  disabled={statusMutation.isPending}
                  className='bg-green-500 hover:bg-green-600 disabled:opacity-50
                    text-white px-4 py-2 rounded-lg text-sm font-medium'>
                  ✓ Approve
                </button>
                <button
                  onClick={() => statusMutation.mutate({ id: listing._id, status: 'rejected' })}
                  disabled={statusMutation.isPending}
                  className='bg-red-500 hover:bg-red-600 disabled:opacity-50
                    text-white px-4 py-2 rounded-lg text-sm font-medium'>
                  ✗ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'users' && (
        <div className='bg-white border border-gray-200 rounded-xl overflow-hidden'>
          <table className='w-full text-sm'>
            <thead className='bg-gray-50 border-b border-gray-200'>
              <tr>
                <th className='text-left p-4 font-semibold text-gray-700'>Name</th>
                <th className='text-left p-4 font-semibold text-gray-700'>Email</th>
                <th className='text-left p-4 font-semibold text-gray-700'>Role</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {users?.map(user => (
                <tr key={user._id} className='hover:bg-gray-50'>
                  <td className='p-4 font-medium'>{user.name}</td>
                  <td className='p-4 text-gray-600'>{user.email}</td>
                  <td className='p-4'>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${user.role === 'admin'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-600'}`}>
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}