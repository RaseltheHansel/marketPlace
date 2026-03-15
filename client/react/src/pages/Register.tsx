import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../api/axios';
import type { AuthResponse } from '../types';

export default function Register() {
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async () => {
      const r = await api.post<AuthResponse>('/auth/register', { name, email, password });
      return r.data;
    },
    onSuccess: (data) => {
      navigate('/verify-email', { state: { email: data.email } });
    },
    onError: () => alert('Registration failed. Email may already be used.'),
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

  const labelStyle = {
    fontSize: '11px',
    color: '#c9a87a',
    display: 'block',
    marginBottom: '7px',
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
  };

  return (
    <div style={{ background: '#1c1209', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: '#2e2010', border: '1px solid #3d2d18', borderRadius: '22px', padding: '40px', width: '100%', maxWidth: '400px' }}>

        {/* Top */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
          <div style={{ width: '52px', height: '52px', background: '#251a0e', border: '1px solid #e85d26', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>
            🛍️
          </div>
          <div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '26px', color: '#f5ede0', lineHeight: 1.1 }}>
              Create account
            </h1>
            <p style={{ fontSize: '13px', color: '#8c7055', marginTop: '2px' }}>
              Join the marketplace today
            </p>
          </div>
        </div>

        {/* Steps indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#e85d26', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff', fontWeight: 600 }}>1</div>
            <span style={{ fontSize: '12px', color: '#f0832f', fontWeight: 500 }}>Details</span>
          </div>
          <div style={{ flex: 1, height: '1px', background: '#3d2d18' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#3d2d18', border: '1px solid #3d2d18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#8c7055', fontWeight: 600 }}>2</div>
            <span style={{ fontSize: '12px', color: '#8c7055' }}>Verify email</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={(e: FormEvent) => { e.preventDefault(); mutation.mutate(); }}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div>
            <label style={labelStyle}>Full Name</label>
            <input type='text' placeholder='Russelle Amorsolo' value={name}
              onChange={e => setName(e.target.value)} required style={inputStyle}
              onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#e85d26'}
              onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#3d2d18'} />
          </div>

          <div>
            <label style={labelStyle}>Email</label>
            <input type='email' placeholder='you@email.com' value={email}
              onChange={e => setEmail(e.target.value)} required style={inputStyle}
              onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#e85d26'}
              onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#3d2d18'} />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <input type='password' placeholder='Min. 6 characters' value={password}
              onChange={e => setPassword(e.target.value)} required minLength={6} style={inputStyle}
              onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#e85d26'}
              onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#3d2d18'} />
          </div>

          {/* Password strength */}
          {password.length > 0 && (
            <div style={{ marginTop: '-8px' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{
                    flex: 1, height: '3px', borderRadius: '2px',
                    background: password.length >= i * 3
                      ? i <= 1 ? '#e85d26' : i <= 2 ? '#f0832f' : i <= 3 ? '#d4a843' : '#4caf50'
                      : '#3d2d18',
                    transition: 'background 0.3s',
                  }} />
                ))}
              </div>
              <p style={{ fontSize: '11px', color: '#8c7055' }}>
                {password.length < 4 ? 'Weak' : password.length < 7 ? 'Fair' : password.length < 10 ? 'Good' : 'Strong'}
              </p>
            </div>
          )}

          <button type='submit' disabled={mutation.isPending}
            style={{
              background: mutation.isPending ? '#7a3010' : '#e85d26',
              color: '#fff', border: 'none', padding: '13px',
              borderRadius: '10px', fontSize: '14px', fontWeight: 600,
              cursor: mutation.isPending ? 'not-allowed' : 'pointer',
              fontFamily: 'Outfit, sans-serif', marginTop: '4px',
              letterSpacing: '0.3px', transition: 'background 0.2s',
            }}>
            {mutation.isPending ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        {/* Terms */}
        <p style={{ fontSize: '11px', color: '#8c7055', textAlign: 'center', marginTop: '16px', lineHeight: 1.6 }}>
          By registering you agree to our{' '}
          <span style={{ color: '#f0832f', cursor: 'pointer' }}>Terms of Service</span>
          {' '}and{' '}
          <span style={{ color: '#f0832f', cursor: 'pointer' }}>Privacy Policy</span>
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#3d2d18' }} />
          <span style={{ fontSize: '12px', color: '#8c7055' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: '#3d2d18' }} />
        </div>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#8c7055' }}>
          Already have an account?{' '}
          <Link to='/login' style={{ color: '#f0832f', fontWeight: 500, textDecoration: 'none' }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}