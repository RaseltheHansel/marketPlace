import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../api/axios';

export default function ResetPassword() {
  const [searchParams]    = useSearchParams();
  const navigate          = useNavigate();
  const email             = searchParams.get('email') || '';
  const token             = searchParams.get('token') || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirm,     setConfirm]     = useState('');

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
    if (newPassword !== confirm) {
      alert('Passwords do not match!');
      return;
    }
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }
    mutation.mutate();
  };

  const inp = 'w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-blue-500 text-sm';

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
      <div className='bg-white rounded-2xl border border-gray-200 p-8 w-full max-w-md'>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>Reset Password</h1>
        <p className='text-sm text-gray-500 mb-6'>Enter your new password below.</p>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <input type='password' placeholder='New password' value={newPassword}
            onChange={e => setNewPassword(e.target.value)} required className={inp} />
          <input type='password' placeholder='Confirm new password' value={confirm}
            onChange={e => setConfirm(e.target.value)} required className={inp} />
          <button type='submit' disabled={mutation.isPending}
            className='w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50
              text-white py-3 rounded-lg font-bold text-sm'>
            {mutation.isPending ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}