import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../api/axios';

export default function ForgotPassword() {
  const [email,   setEmail]   = useState('');
  const [sent,    setSent]    = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      await api.post('/auth/forgot-password', { email });
    },
    onSuccess: () => setSent(true),
    onError:   () => alert('Something went wrong. Try again.'),
  });

  const inp = 'w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-blue-500 text-sm';

  if (sent) return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
      <div className='bg-white rounded-2xl border border-gray-200 p-8 w-full max-w-md text-center'>
        <div className='text-5xl mb-4'>📬</div>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>Check your email</h1>
        <p className='text-sm text-gray-500 mb-6'>
          If <strong>{email}</strong> has an account, a reset link has been sent.
        </p>
        <Link to='/login' className='text-blue-600 hover:underline text-sm font-medium'>
          Back to Login
        </Link>
      </div>
    </div>
  );

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
      <div className='bg-white rounded-2xl border border-gray-200 p-8 w-full max-w-md'>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>Forgot Password</h1>
        <p className='text-sm text-gray-500 mb-6'>
          Enter your email and we'll send you a reset link.
        </p>
        <form onSubmit={(e: FormEvent) => { e.preventDefault(); mutation.mutate(); }}
          className='space-y-4'>
          <input type='email' placeholder='Your email' value={email}
            onChange={e => setEmail(e.target.value)} required className={inp} />
          <button type='submit' disabled={mutation.isPending}
            className='w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50
              text-white py-3 rounded-lg font-bold text-sm'>
            {mutation.isPending ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <p className='text-sm text-center text-gray-500 mt-4'>
          <Link to='/login' className='text-blue-600 hover:underline font-medium'>
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}