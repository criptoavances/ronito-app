'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { api } from '../../lib/api';

export default function EveningPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [step, setStep] = useState(1);
  const [reflection, setReflection] = useState({
    what_done: '',
    what_didnt: '',
    why_didnt: '',
    three_good_things: ['', '', ''],
    day_rating: 5,
    journal_entry: '',
    tomorrow_preview: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const today = new Date().toISOString().split('T')[0];

      await api.reflections.create({
        ...reflection,
        entry_date: today,
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
      {/* Header */}
      <header className="text-white py-8">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-2">Good Evening 🌙</h1>
          <p className="text-lg opacity-90">Reflect on your day</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-8">
        {/* Step 1: Day Summary */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">How was your day?</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What did you accomplish?
                </label>
                <textarea
                  value={reflection.what_done}
                  onChange={(e) =>
                    setReflection({ ...reflection, what_done: e.target.value })
                  }
                  placeholder="The wins, big and small..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What didn't get done?
                </label>
                <textarea
                  value={reflection.what_didnt}
                  onChange={(e) =>
                    setReflection({ ...reflection, what_didnt: e.target.value })
                  }
                  placeholder="No judgment. What fell off the list?"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Why didn't it happen?
                </label>
                <textarea
                  value={reflection.why_didnt}
                  onChange={(e) =>
                    setReflection({ ...reflection, why_didnt: e.target.value })
                  }
                  placeholder="Be honest. What got in the way?"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg"
            >
              Next →
            </button>
          </div>
        )}

        {/* Step 2: Gratitude */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">3 Good Things</h2>
            <p className="text-gray-600 mb-4">What went well today? Find the good.</p>

            <div className="space-y-4 mb-6">
              {reflection.three_good_things.map((thing, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={thing}
                  onChange={(e) => {
                    const newThings = [...reflection.three_good_things];
                    newThings[idx] = e.target.value;
                    setReflection({ ...reflection, three_good_things: newThings });
                  }}
                  placeholder={`Good thing ${idx + 1}`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Rating */}
        {step === 3 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Rate Your Day</h2>
            <p className="text-gray-600 mb-6">1 (rough) to 10 (amazing)</p>

            <div className="mb-6">
              <div className="flex justify-between items-end gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => setReflection({ ...reflection, day_rating: num })}
                    className={`flex-1 py-4 rounded-lg font-bold transition ${
                      reflection.day_rating === num
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 border border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Journal & Tomorrow */}
        {step === 4 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Reflect & Plan Tomorrow</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Journal Entry
                </label>
                <textarea
                  value={reflection.journal_entry}
                  onChange={(e) =>
                    setReflection({ ...reflection, journal_entry: e.target.value })
                  }
                  placeholder="Free-form thoughts. Anything on your mind?"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tomorrow's Preview
                </label>
                <textarea
                  value={reflection.tomorrow_preview}
                  onChange={(e) =>
                    setReflection({ ...reflection, tomorrow_preview: e.target.value })
                  }
                  placeholder="What's on the agenda? One thing you're looking forward to?"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(3)}
                className="flex-1 border border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Sleep Well →'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
