'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { api } from '../../lib/api';

export default function EveningPage() {
  const router = useRouter();
  const { isAuthenticated, loading, user } = useAuth();
  const [step, setStep] = useState(1);
  const [amazingThings, setAmazingThings] = useState(['', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  const handleAmazingThingChange = (index: number, value: string) => {
    const newThings = [...amazingThings];
    newThings[index] = value;
    setAmazingThings(newThings);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const today = new Date().toISOString().split('T')[0];

      await api.gratitude.create({
        entry_date: today,
        gratitude_items: amazingThings.filter((t) => t.trim()),
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to save evening routine:', error);
      alert('Failed to save. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700">
      <header className="text-white py-8">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-2">Good Evening 🌙</h1>
          <p className="text-lg opacity-90">Remember 3 amazing things before sleep</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-8">
        {/* Step 1: Greeting */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-4 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome back, {user?.name || 'friend'}</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Before you sleep, let's remember the amazing moments from today. This will help you sleep happy. 💫
            </p>
            <button
              onClick={() => setStep(2)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg text-lg"
            >
              Let's Begin →
            </button>
          </div>
        )}

        {/* Step 2: Three Amazing Things */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">3 Amazing Things</h2>
            <p className="text-gray-600 mb-8">What happened today that made you smile or feel good?</p>

            <div className="space-y-4 mb-8">
              {[0, 1, 2].map((idx) => (
                <div key={idx}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amazing thing #{idx + 1} ⭐
                  </label>
                  <textarea
                    value={amazingThings[idx]}
                    onChange={(e) => handleAmazingThingChange(idx, e.target.value)}
                    placeholder={`Something wonderful that happened today...`}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ))}
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-8">
              <p className="text-sm text-indigo-800">
                ✨ These good thoughts will help you sleep peacefully. Your brain will rest on these happy memories.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || amazingThings.every((t) => !t.trim())}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg"
              >
                {isSubmitting ? 'Saving...' : 'Sleep Well 😴'}
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-white hover:underline text-sm"
          >
            Skip to Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}
