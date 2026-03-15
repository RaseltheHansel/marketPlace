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
            Control panel
          </p>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '30px', color: '#f5ede0' }}>
            Admin Dashboard
          </h1>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', borderBottom: '1px solid #3d2d18', paddingBottom: '0' }}>
          {([
            { key: 'listings', label: `Pending Listings`, count: pending?.length ?? 0 },
            { key: 'users',    label: 'All Users',        count: null },
          ] as { key: Tab; label: string; count: number | null }[]).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif', fontSize: '14px', fontWeight: 500,
                color: tab === t.key ? '#f0832f' : '#8c7055',
                padding: '10px 4px',
                borderBottom: `2px solid ${tab === t.key ? '#e85d26' : 'transparent'}`,
                marginBottom: '-1px',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
              {t.label}
              {t.count !== null && (
                <span style={{
                  background: t.count > 0 ? '#e85d26' : '#2e2010',
                  border: `1px solid ${t.count > 0 ? '#e85d26' : '#3d2d18'}`,
                  color: t.count > 0 ? '#fff' : '#8c7055',
                  fontSize: '11px', padding: '1px 8px', borderRadius: '20px', fontWeight: 600,
                }}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* LISTINGS TAB */}
        {tab === 'listings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
                  src={listing.images[0] || 'https://placehold.co/100x100?text=No+Image'}
                  alt={listing.title}
                  style={{ width: '96px', height: '96px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #3d2d18', flexShrink: 0 }}
                />

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '15px', fontWeight: 500, color: '#f5ede0', marginBottom: '4px' }}>
                    {listing.title}
                  </p>
                  <p style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', color: '#f0832f', fontWeight: 600, marginBottom: '6px' }}>
                    ₱{listing.price.toLocaleString()}
                  </p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', color: '#8c7055' }}>📍 {listing.location}</span>
                    <span style={{ fontSize: '11px', color: '#8c7055' }}>· {listing.condition}</span>
                    <span style={{ fontSize: '11px', color: '#8c7055' }}>· {listing.category}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#8c7055', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '400px' }}>
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
                    style={{
                      background: 'rgba(76,175,80,0.15)', border: '1px solid #4caf50',
                      color: '#4caf50', padding: '8px 18px', borderRadius: '8px',
                      fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                      fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s',
                      opacity: statusMutation.isPending ? 0.5 : 1,
                    }}>
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => statusMutation.mutate({ id: listing._id, status: 'rejected' })}
                    disabled={statusMutation.isPending}
                    style={{
                      background: 'rgba(232,93,38,0.15)', border: '1px solid #e85d26',
                      color: '#e85d26', padding: '8px 18px', borderRadius: '8px',
                      fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                      fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s',
                      opacity: statusMutation.isPending ? 0.5 : 1,
                    }}>
                    ✗ Reject
                  </button>
                  <button
                    onClick={() => { if (confirm('Delete this listing?')) deleteMutation.mutate(listing._id); }}
                    disabled={deleteMutation.isPending}
                    style={{
                      background: '#251a0e', border: '1px solid #3d2d18',
                      color: '#8c7055', padding: '8px 18px', borderRadius: '8px',
                      fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                      fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s',
                      opacity: deleteMutation.isPending ? 0.5 : 1,
                    }}>
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* USERS TAB */}
        {tab === 'users' && (
          <div style={{ background: '#2e2010', border: '1px solid #3d2d18', borderRadius: '16px', overflow: 'hidden' }}>
            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', padding: '12px 20px', borderBottom: '1px solid #3d2d18', background: '#251a0e' }}>
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
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(232,93,38,0.2)', border: '1px solid #e85d26', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 600, color: '#f0832f', flexShrink: 0 }}>
                    {user.name[0].toUpperCase()}
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: '#f5ede0' }}>{user.name}</p>
                </div>

                {/* Email */}
                <p style={{ fontSize: '13px', color: '#8c7055' }}>{user.email}</p>

                {/* Role */}
                <span style={{
                  display: 'inline-block',
                  background: user.role === 'admin' ? 'rgba(212,168,67,0.15)' : '#251a0e',
                  border: `1px solid ${user.role === 'admin' ? '#d4a843' : '#3d2d18'}`,
                  color: user.role === 'admin' ? '#d4a843' : '#8c7055',
                  fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: 500,
                }}>
                  {user.role === 'admin' ? '👑 admin' : 'user'}
                </span>
              </div>
            ))}

            {/* Empty */}
            {users?.length === 0 && (
              <p style={{ textAlign: 'center', padding: '40px', color: '#8c7055', fontSize: '14px' }}>
                No users found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}