import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../api/axios';

export default function ResetPassword() {
  const [searchParams]                  = useSearchParams();
  const navigate                        = useNavigate();
  const email                           = searchParams.get('email') || '';
  const token                           = searchParams.get('token') || '';
  const [newPassword, setNewPassword]   = useState('');
  const [confirm,     setConfirm]       = useState('');
  const [showNew,     setShowNew]       = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      await api.post('/auth/reset-password', { email, token, newPassword });
    },
    onSuccess: () => {
      alert('Password reset! Please login with your new password.');
      navigate('/login');
    },
    onError: () => alert('Invalid or expired reset link.'),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirm) { alert('Passwords do not match!'); return; }
    if (newPassword.length < 6)  { alert('Password must be at least 6 characters.'); return; }
    mutation.mutate();
  };

  const inputStyle = {
    width: '100%',
    background: '#251a0e',
    border: '1px solid #3d2d18',
    color: '#f5ede0',
    padding: '12px 14px',
    borderRadius: '10px',
    fontSize: '14px',
    fontFamily: 'Outfit, sans-serif',
    outline: 'none',
  };

  const labelStyle = {
    fontSize: '11px',
    color: '#c9a87a',
    display: 'block',
    marginBottom: '7px',
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
  };

  const match = newPassword && confirm && newPassword === confirm;
  const noMatch = newPassword && confirm && newPassword !== confirm;

  return (
    <div style={{ background: '#1c1209', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: '#2e2010', border: '1px solid #3d2d18', borderRadius: '22px', padding: '40px', width: '100%', maxWidth: '400px' }}>

        {/* Icon + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
          <div style={{ width: '52px', height: '52px', background: '#251a0e', border: '1px solid #e85d26', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>
            🔒
          </div>
          <div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', color: '#f5ede0', lineHeight: 1.1 }}>
              Reset password
            </h1>
            <p style={{ fontSize: '13px', color: '#8c7055', marginTop: '2px' }}>
              Choose a strong new password
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* New password */}
          <div>
            <label style={labelStyle}>New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showNew ? 'text' : 'password'}
                placeholder='Min. 6 characters'
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required style={{ ...inputStyle, paddingRight: '44px' }}
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#e85d26'}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#3d2d18'}
              />
              <button type='button' onClick={() => setShowNew(!showNew)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#8c7055', cursor: 'pointer', fontSize: '16px' }}>
                {showNew ? '🙈' : '👁'}
              </button>
            </div>

            {/* Strength bar */}
            {newPassword.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: newPassword.length >= i * 3 ? i <= 1 ? '#e85d26' : i <= 2 ? '#f0832f' : i <= 3 ? '#d4a843' : '#4caf50' : '#3d2d18', transition: 'background 0.3s' }} />
                  ))}
                </div>
                <p style={{ fontSize: '11px', color: '#8c7055' }}>
                  {newPassword.length < 4 ? 'Weak' : newPassword.length < 7 ? 'Fair' : newPassword.length < 10 ? 'Good' : 'Strong'}
                </p>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label style={labelStyle}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder='Repeat your password'
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                style={{ ...inputStyle, paddingRight: '44px', borderColor: noMatch ? '#e85d26' : match ? '#4caf50' : '#3d2d18' }}
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = noMatch ? '#e85d26' : match ? '#4caf50' : '#e85d26'}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = noMatch ? '#e85d26' : match ? '#4caf50' : '#3d2d18'}
              />
              <button type='button' onClick={() => setShowConfirm(!showConfirm)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#8c7055', cursor: 'pointer', fontSize: '16px' }}>
                {showConfirm ? '🙈' : '👁'}
              </button>
            </div>
            {match   && <p style={{ fontSize: '11px', color: '#4caf50', marginTop: '4px' }}>✓ Passwords match</p>}
            {noMatch && <p style={{ fontSize: '11px', color: '#e85d26', marginTop: '4px' }}>✗ Passwords do not match</p>}
          </div>

          <button type='submit' disabled={mutation.isPending || !!noMatch}
            style={{ background: noMatch ? '#3d2d18' : mutation.isPending ? '#7a3010' : '#e85d26', color: noMatch ? '#8c7055' : '#fff', border: 'none', padding: '13px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: noMatch || mutation.isPending ? 'not-allowed' : 'pointer', fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s' }}>
            {mutation.isPending ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}