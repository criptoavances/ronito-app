'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { api } from '../../lib/api';

type RoutineComponent = 'greeting' | 'why' | 'gratitude' | 'goals' | 'motivation';

export default function MorningPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [bigGoal, setBigGoal] = useState<any>(null);
  const [gratitudeThings, setGratitudeThings] = useState(['', '', '']);
  const [dailyGoals, setDailyGoals] = useState(['', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Default routine: all components enabled
  const routineComponents: RoutineComponent[] = ['greeting', 'why', 'gratitude', 'goals', 'motivation'];

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await api.goals.big.get();
      setBigGoal(response.data || null);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep < routineComponents.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleRoutineComplete();
    }
  };

  const handleRoutineComplete = async () => {
    setIsSubmitting(true);
    try {
      const today = new Date().toISOString().split('T')[0];

      // Save gratitude
      if (gratitudeThings.some((t) => t)) {
        await api.gratitude.create({
          entry_date: today,
          gratitude_items: gratitudeThings.filter((t) => t),
        });
      }

      // Save daily goals
      for (const goal of dailyGoals.filter((g) => g)) {
        await api.goals.daily.create({
          title: goal,
          goal_date: today,
        });
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to save morning routine:', error);
      alert('Failed to save. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500">
      {/* Header */}
      <header className="text-white py-8">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-2">Good Morning 🌅</h1>
          <p className="text-lg opacity-90">Start your day with intention</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-8">
        {/* Step 1: Big Goal */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Why Today</h2>
            {bigGoal ? (
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-600">
                  <p className="font-semibold text-gray-800">{bigGoal.title}</p>
                  {bigGoal.why && <p className="text-gray-600 mt-2 italic">{bigGoal.why}</p>}
                </div>
                <p className="text-gray-600 text-center">
                  This is your north star. Keep this in mind as you plan your day.
                </p>
              </div>
            ) : (
              <p className="text-gray-600">Set your big goal in onboarding to see it here.</p>
            )}
            <button
              onClick={() => setStep(2)}
              className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg"
            >
              Next →
            </button>
          </div>
        )}

        {/* Step 2: Gratitude */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">What are you grateful for?</h2>
            <p className="text-gray-600 mb-6">Share 3 things, big or small.</p>

            <div className="space-y-4 mb-6">
              {gratitudeThings.map((thing, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thing {idx + 1}
                  </label>
                  <input
                    type="text"
                    value={thing}
                    onChange={(e) => {
                      const newThings = [...gratitudeThings];
                      newThings[idx] = e.target.value;
                      setGratitudeThings(newThings);
                    }}
                    placeholder={`e.g., ${idx === 0 ? 'My family' : idx === 1 ? 'Good health' : 'This sunny day'}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Daily Goals */}
        {step === 3 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Pick 3 Goals for Today</h2>
            <p className="text-gray-600 mb-6">Non-negotiable. Focus on these.</p>

            <div className="space-y-4 mb-6">
              {dailyGoals.map((goal, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Goal {idx + 1}
                  </label>
                  <input
                    type="text"
                    value={goal}
                    onChange={(e) => {
                      const newGoals = [...dailyGoals];
                      newGoals[idx] = e.target.value;
                      setDailyGoals(newGoals);
                    }}
                    placeholder={`e.g., ${idx === 0 ? 'Finish project X' : idx === 1 ? 'Exercise 30min' : 'Read 20 pages'}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 border border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Start Your Day →'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
