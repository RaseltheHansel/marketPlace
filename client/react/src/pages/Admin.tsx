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

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/listings/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-pending'] }),
  });

  return (
    <div style={{ background: '#1c1209', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <p style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#e85d26', fontWeight: 500, marginBottom: '6px' }}>
            Management
          </p>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '30px', color: '#f5ede0' }}>
            Admin Dashboard
          </h1>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
          {[
            { num: pending?.length ?? 0, label: 'Pending review', color: '#d4a843' },
            { num: users?.length ?? 0,   label: 'Total users',    color: '#f0832f' },
            { num: 0,                    label: 'Approved today', color: '#4caf50' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#2e2010', border: '1px solid #3d2d18', borderRadius: '14px', padding: '18px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: '30px', fontWeight: 600, color: s.color }}>
                {s.num}
              </div>
              <div style={{ fontSize: '12px', color: '#8c7055', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {([['listings', `Pending Listings (${pending?.length ?? 0})`], ['users', 'All Users']] as [Tab, string][]).map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif',
                border: 'none',
                transition: 'all 0.2s',
                background: tab === t ? '#e85d26' : '#2e2010',
                color: tab === t ? '#fff' : '#8c7055',
                outline: tab === t ? 'none' : '1px solid #3d2d18',
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* Pending Listings Tab */}
        {tab === 'listings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pending?.length === 0 && (
              <div style={{ textAlign: 'center', padding: '64px 24px', background: '#2e2010', border: '1px solid #3d2d18', borderRadius: '20px' }}>
                <p style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</p>
                <p style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', color: '#f5ede0', marginBottom: '6px' }}>
                  All caught up!
                </p>
                <p style={{ fontSize: '14px', color: '#8c7055' }}>No pending listings to review.</p>
              </div>
            )}
            {pending?.map(listing => (
              <div key={listing._id}
                style={{ background: '#2e2010', border: '1px solid #3d2d18', borderRadius: '16px', padding: '16px', display: 'flex', gap: '16px', transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#e85d26')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#3d2d18')}>

                {/* Image */}
                <img
                  src={listing.images[0] || 'https://placehold.co/100x100'}
                  alt={listing.title}
                  style={{ width: '96px', height: '96px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #3d2d18', flexShrink: 0 }}
                />

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '15px', fontWeight: 500, color: '#f5ede0', marginBottom: '2px' }}>
                    {listing.title}
                  </p>
                  <p style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: 600, color: '#f0832f', marginBottom: '6px' }}>
                    ₱{listing.price.toLocaleString()}
                  </p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: '#8c7055' }}>📍 {listing.location}</span>
                    <span style={{ fontSize: '12px', color: '#8c7055' }}>· {listing.condition}</span>
                    <span style={{ fontSize: '12px', color: '#8c7055' }}>· {listing.category}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#8c7055', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {listing.description}
                  </p>
                  <p style={{ fontSize: '11px', color: '#d4a843', marginTop: '4px' }}>
                    Seller: {listing.seller?.name}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                  <button
                    onClick={() => statusMutation.mutate({ id: listing._id, status: 'approved' })}
                    disabled={statusMutation.isPending}
                    style={{ background: 'rgba(76,175,80,0.15)', border: '1px solid #4caf50', color: '#4caf50', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s' }}>
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => statusMutation.mutate({ id: listing._id, status: 'rejected' })}
                    disabled={statusMutation.isPending}
                    style={{ background: 'rgba(232,93,38,0.15)', border: '1px solid #e85d26', color: '#e85d26', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s' }}>
                    ✗ Reject
                  </button>
                  <button
                    onClick={() => { if (confirm('Delete this listing?')) deleteMutation.mutate(listing._id); }}
                    disabled={deleteMutation.isPending}
                    style={{ background: '#251a0e', border: '1px solid #3d2d18', color: '#8c7055', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s' }}>
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div style={{ background: '#2e2010', border: '1px solid #3d2d18', borderRadius: '16px', overflow: 'hidden' }}>

            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', padding: '14px 20px', borderBottom: '1px solid #3d2d18', background: '#251a0e' }}>
              {['Name', 'Email', 'Role'].map(h => (
                <p key={h} style={{ fontSize: '11px', color: '#8c7055', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 500 }}>
                  {h}
                </p>
              ))}
            </div>

            {/* Rows */}
            {users?.map((user, i) => (
              <div key={user._id}
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', padding: '14px 20px', borderBottom: i < (users.length - 1) ? '1px solid #3d2d18' : 'none', alignItems: 'center', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#251a0e')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>

                {/* Name with avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(232,93,38,0.2)', border: '1px solid #e85d26', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 600, color: '#f0832f', flexShrink: 0 }}>
                    {user.name[0].toUpperCase()}
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#f5ede0' }}>{user.name}</span>
                </div>

                {/* Email */}
                <span style={{ fontSize: '13px', color: '#8c7055' }}>{user.email}</span>

                {/* Role badge */}
                <span style={{
                  fontSize: '11px', padding: '4px 12px', borderRadius: '20px', fontWeight: 500, display: 'inline-block',
                  background: user.role === 'admin' ? 'rgba(212,168,67,0.15)' : '#251a0e',
                  border: `1px solid ${user.role === 'admin' ? '#d4a843' : '#3d2d18'}`,
                  color: user.role === 'admin' ? '#d4a843' : '#8c7055',
                }}>
                  {user.role === 'admin' ? '👑 Admin' : 'User'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}