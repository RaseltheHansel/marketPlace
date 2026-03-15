import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../api/axios';
import type { AuthResponse } from '../types';

export default function Login() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async () => {
      const r = await api.post<AuthResponse>('/auth/login', { email, password });
      return r.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    },
    onError: () => alert('Login failed. Check your email and password.'),
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

        {/* Top */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
          <div style={{ width: '52px', height: '52px', background: '#251a0e', border: '1px solid #e85d26', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>
            🛍️
          </div>
          <div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '26px', color: '#f5ede0', lineHeight: 1.1 }}>
              Welcome back
            </h1>
            <p style={{ fontSize: '13px', color: '#8c7055', marginTop: '2px' }}>
              Login to your account
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={(e: FormEvent) => { e.preventDefault(); mutation.mutate(); }}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div>
            <label style={{ fontSize: '11px', color: '#c9a87a', display: 'block', marginBottom: '7px', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Email
            </label>
            <input type='email' placeholder='you@email.com' value={email}
              onChange={e => setEmail(e.target.value)} required style={inputStyle}
              onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#e85d26'}
              onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#3d2d18'} />
          </div>

          <div>
            <label style={{ fontSize: '11px', color: '#c9a87a', display: 'block', marginBottom: '7px', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Password
            </label>
            <input type='password' placeholder='••••••••' value={password}
              onChange={e => setPassword(e.target.value)} required style={inputStyle}
              onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#e85d26'}
              onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#3d2d18'} />
            <div style={{ textAlign: 'right', marginTop: '8px' }}>
              <Link to='/forgot-password'
                style={{ fontSize: '12px', color: '#f0832f', textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>
          </div>

          <button type='submit' disabled={mutation.isPending}
            style={{
              background: mutation.isPending ? '#7a3010' : '#e85d26',
              color: '#fff', border: 'none', padding: '13px',
              borderRadius: '10px', fontSize: '14px', fontWeight: 600,
              cursor: mutation.isPending ? 'not-allowed' : 'pointer',
              fontFamily: 'Outfit, sans-serif', marginTop: '4px',
              letterSpacing: '0.3px', transition: 'background 0.2s',
            }}>
            {mutation.isPending ? 'Logging in...' : 'Login to Marketplace'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#3d2d18' }} />
          <span style={{ fontSize: '12px', color: '#8c7055' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: '#3d2d18' }} />
        </div>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#8c7055' }}>
          No account yet?{' '}
          <Link to='/register' style={{ color: '#f0832f', fontWeight: 500, textDecoration: 'none' }}>
            Register for free
          </Link>
        </p>
      </div>
    </div>
  );
}