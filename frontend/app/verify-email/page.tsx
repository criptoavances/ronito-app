'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token || !email) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const response = await fetch(`/api/email/verify-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, email }),
        });

        if (response.ok) {
          setStatus('success');
          setMessage('Email verified! Redirecting to login...');
          setTimeout(() => router.push('/login'), 2000);
        } else {
          setStatus('error');
          setMessage('Verification failed. Link may have expired.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Network error. Please try again.');
      }
    };

    verifyEmail();
  }, [token, email, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">RONITO</h1>

        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying your email...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Email Verified!</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-red-600 text-5xl mb-4">✗</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg"
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
