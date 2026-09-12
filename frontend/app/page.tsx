'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth-context';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-purple-600 mb-2">RONITO</h1>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-purple-600 mb-2">RONITO</h1>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
        <h1 className="text-5xl font-bold text-purple-600 mb-4">RONITO</h1>
        <p className="text-lg text-gray-700 mb-2">Your AI Life Manager</p>
        <p className="text-gray-600 mb-8">Transform your daily life with purpose, gratitude, and AI guidance.</p>

        <div className="space-y-3">
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition text-lg"
          >
            Launch App
          </button>
          <button
            onClick={() => router.push('/signup')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition text-lg"
          >
            Create Account
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Beta access • Early believers only
        </p>
      </div>
    </div>
  );
}
