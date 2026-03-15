import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../api/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent,  setSent]  = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      await api.post('/auth/forgot-password', { email });
    },
    onSuccess: () => setSent(true),
    onError:   () => alert('Something went wrong. Try again.'),
  });

  if (sent) return (
    <div style={{ background: '#1c1209', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: '#2e2010', border: '1px solid #3d2d18', borderRadius: '22px', padding: '40px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <div style={{ width: '72px', height: '72px', background: '#251a0e', border: '1px solid #4caf50', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', margin: '0 auto 20px' }}>
          📬
        </div>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '26px', color: '#f5ede0', marginBottom: '10px' }}>
          Email sent!
        </h1>
        <p style={{ fontSize: '13px', color: '#8c7055', lineHeight: 1.7, marginBottom: '28px' }}>
          If <span style={{ color: '#f0832f' }}>{email}</span> has an account,
          a reset link has been sent. Check your inbox and spam folder.
        </p>
        <div style={{ height: '1px', background: '#3d2d18', marginBottom: '24px' }} />
        <Link to='/login'
          style={{ color: '#f0832f', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>
          ← Back to Login
        </Link>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#1c1209', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: '#2e2010', border: '1px solid #3d2d18', borderRadius: '22px', padding: '40px', width: '100%', maxWidth: '400px' }}>

        {/* Icon + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
          <div style={{ width: '52px', height: '52px', background: '#251a0e', border: '1px solid #e85d26', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>
            🔑
          </div>
          <div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', color: '#f5ede0', lineHeight: 1.1 }}>
              Forgot password?
            </h1>
            <p style={{ fontSize: '13px', color: '#8c7055', marginTop: '2px' }}>
              We'll send you a reset link
            </p>
          </div>
        </div>

        <form onSubmit={(e: FormEvent) => { e.preventDefault(); mutation.mutate(); }}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', color: '#c9a87a', display: 'block', marginBottom: '7px', letterSpacing: '1px', textTransform: 'uppercase' as const }}>
              Email address
            </label>
            <input type='email' placeholder='you@email.com' value={email}
              onChange={e => setEmail(e.target.value)} required
              style={{ width: '100%', background: '#251a0e', border: '1px solid #3d2d18', color: '#f5ede0', padding: '12px 14px', borderRadius: '10px', fontSize: '14px', fontFamily: 'Outfit, sans-serif', outline: 'none' }}
              onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#e85d26'}
              onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#3d2d18'} />
          </div>

          <button type='submit' disabled={mutation.isPending}
            style={{ background: mutation.isPending ? '#7a3010' : '#e85d26', color: '#fff', border: 'none', padding: '13px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: mutation.isPending ? 'not-allowed' : 'pointer', fontFamily: 'Outfit, sans-serif', transition: 'background 0.2s' }}>
            {mutation.isPending ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div style={{ height: '1px', background: '#3d2d18', margin: '24px 0' }} />

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#8c7055' }}>
          Remember your password?{' '}
          <Link to='/login' style={{ color: '#f0832f', fontWeight: 500, textDecoration: 'none' }}>
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}