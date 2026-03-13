import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../api/axios';
import type { AuthResponse } from '../types';

export default function VerifyEmail() {
  const location  = useLocation();
  const navigate  = useNavigate();
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

  const inp = 'w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-blue-500 text-sm';

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
      <div className='bg-white rounded-2xl border border-gray-200 p-8 w-full max-w-md'>
        <div className='text-center mb-6'>
          <div className='text-5xl mb-3'>📧</div>
          <h1 className='text-2xl font-bold text-gray-900'>Check your email</h1>
          <p className='text-sm text-gray-500 mt-1'>
            We sent a 6-digit code to <strong>{email}</strong>
          </p>
        </div>
        <form onSubmit={(e: FormEvent) => { e.preventDefault(); mutation.mutate(); }}
          className='space-y-4'>
          {!emailFromState && (
            <input type='email' placeholder='Your email' value={email}
              onChange={e => setEmail(e.target.value)} required className={inp} />
          )}
          <input
            type='text'
            placeholder='Enter 6-digit code'
            value={code}
            onChange={e => setCode(e.target.value)}
            maxLength={6}
            required
            className={inp + ' text-center text-2xl tracking-widest font-bold'}
          />
          <button type='submit' disabled={mutation.isPending}
            className='w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50
              text-white py-3 rounded-lg font-bold text-sm'>
            {mutation.isPending ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>
        <p className='text-xs text-center text-gray-400 mt-4'>
          Didn't receive it? Check your spam folder.
        </p>
      </div>
    </div>
  );
}