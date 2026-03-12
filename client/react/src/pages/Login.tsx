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

  const inp = 'w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-blue-500 text-sm';

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
      <div className='bg-white rounded-2xl border border-gray-200 p-8 w-full max-w-md'>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>Welcome Back</h1>
        <p className='text-sm text-gray-500 mb-6'>Login to your account</p>
        <form onSubmit={(e: FormEvent) => { e.preventDefault(); mutation.mutate(); }}
          className='space-y-4'>
          <input type='email' placeholder='Email' value={email}
            onChange={e => setEmail(e.target.value)} required className={inp} />
          <input type='password' placeholder='Password' value={password}
            onChange={e => setPassword(e.target.value)} required className={inp} />
          <button type='submit' disabled={mutation.isPending}
            className='w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50
              text-white py-3 rounded-lg font-bold text-sm'>
            {mutation.isPending ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className='text-sm text-center text-gray-500 mt-4'>
          No account yet?{' '}
          <Link to='/register' className='text-blue-600 hover:underline font-medium'>Register</Link>
        </p>
      </div>
    </div>
  );
}