import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../api/axios';
import type { AuthResponse } from '../types';

export default function VerifyEmail() {
  const location       = useLocation();
  const navigate       = useNavigate();
  const emailFromState = (location.state as { email?: string })?.email || '';
  const [email, setEmail] = useState(emailFromState);
  const [code,  setCode]  = useState('');

  const mutation = useMutation({
    mutationFn: async () => {
      const r = await api.post<AuthResponse>('/auth/verify-email', { email, code });
      return r.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    },
    onError: () => alert('Invalid or expired code. Please try again.'),
  });

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

  return (
    <div style={{ background: '#1c1209', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: '#2e2010', border: '1px solid #3d2d18', borderRadius: '22px', padding: '40px', width: '100%', maxWidth: '400px' }}>

        {/* Steps indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#3d2d18', border: '1px solid #4caf50', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#4caf50', fontWeight: 600 }}>✓</div>
            <span style={{ fontSize: '12px', color: '#8c7055' }}>Details</span>
          </div>
          <div style={{ flex: 1, height: '1px', background: '#e85d26' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#e85d26', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff', fontWeight: 600 }}>2</div>
            <span style={{ fontSize: '12px', color: '#f0832f', fontWeight: 500 }}>Verify email</span>
          </div>
        </div>

        {/* Icon + Title */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '72px', height: '72px', background: '#251a0e', border: '1px solid #e85d26', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', margin: '0 auto 16px' }}>
            📧
          </div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '26px', color: '#f5ede0', marginBottom: '8px' }}>
            Check your email
          </h1>
          <p style={{ fontSize: '13px', color: '#8c7055', lineHeight: 1.6 }}>
            We sent a 6-digit code to{' '}
            <span style={{ color: '#f0832f', fontWeight: 500 }}>{email}</span>
          </p>
        </div>

        <form onSubmit={(e: FormEvent) => { e.preventDefault(); mutation.mutate(); }}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {!emailFromState && (
            <div>
              <label style={{ fontSize: '11px', color: '#c9a87a', display: 'block', marginBottom: '7px', letterSpacing: '1px', textTransform: 'uppercase' as const }}>
                Email
              </label>
              <input type='email' placeholder='you@email.com' value={email}
                onChange={e => setEmail(e.target.value)} required style={inputStyle}
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#e85d26'}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#3d2d18'} />
            </div>
          )}

          <div>
            <label style={{ fontSize: '11px', color: '#c9a87a', display: 'block', marginBottom: '7px', letterSpacing: '1px', textTransform: 'uppercase' as const }}>
              Verification Code
            </label>
            <input
              type='text'
              placeholder='000000'
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              required
              style={{
                ...inputStyle,
                textAlign: 'center',
                fontSize: '32px',
                letterSpacing: '12px',
                fontFamily: 'Fraunces, serif',
                fontWeight: 600,
                color: '#f0832f',
                padding: '16px',
              }}
              onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#e85d26'}
              onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#3d2d18'}
            />
            {/* Code progress dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '10px' }}>
              {[0,1,2,3,4,5].map(i => (
                <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: code.length > i ? '#e85d26' : '#3d2d18', transition: 'background 0.2s' }} />
              ))}
            </div>
          </div>

          <button type='submit' disabled={mutation.isPending || code.length < 6}
            style={{
              background: code.length < 6 ? '#3d2d18' : mutation.isPending ? '#7a3010' : '#e85d26',
              color: code.length < 6 ? '#8c7055' : '#fff',
              border: 'none', padding: '13px',
              borderRadius: '10px', fontSize: '14px', fontWeight: 600,
              cursor: code.length < 6 ? 'not-allowed' : 'pointer',
              fontFamily: 'Outfit, sans-serif', marginTop: '4px',
              transition: 'all 0.2s',
            }}>
            {mutation.isPending ? 'Verifying...' : 'Verify Email →'}
          </button>
        </form>

        <p style={{ fontSize: '12px', color: '#8c7055', textAlign: 'center', marginTop: '20px', lineHeight: 1.6 }}>
          Didn't receive it? Check your spam folder or{' '}
          <span style={{ color: '#f0832f', cursor: 'pointer' }}>resend the code</span>
        </p>
      </div>
    </div>
  );
}