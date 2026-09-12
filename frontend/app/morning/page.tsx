'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { api } from '../../lib/api';
import MorningGreeting from '../../components/morning/MorningGreeting';
import MorningWhyReminder from '../../components/morning/MorningWhyReminder';
import MorningGratitude from '../../components/morning/MorningGratitude';
import MorningGoalSetter from '../../components/morning/MorningGoalSetter';
import MorningMotivation from '../../components/morning/MorningMotivation';

type RoutineComponent = 'greeting' | 'why' | 'gratitude' | 'goals' | 'motivation';

export default function MorningPage() {
  const router = useRouter();
  const { isAuthenticated, loading, user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [bigGoal, setBigGoal] = useState<any>(null);
  const [gratitudeThings, setGratitudeThings] = useState(['', '', '']);
  const [dailyGoals, setDailyGoals] = useState(['', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRoutineComplete = async () => {
    setIsSubmitting(true);
    try {
      const today = new Date().toISOString().split('T')[0];

      if (gratitudeThings.some((t) => t)) {
        await api.gratitude.create({
          entry_date: today,
          things: gratitudeThings.filter((t) => t),
        });
      }

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
      <header className="text-white py-8">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-2">Good Morning 🌅</h1>
          <p className="text-lg opacity-90">Start your day with intention</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-8">
        <div className="mb-4 text-white text-center text-sm">
          Step {currentStep + 1} of {routineComponents.length}
        </div>

        <div className="w-full bg-white/20 rounded-full h-2 mb-6">
          <div
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / routineComponents.length) * 100}%` }}
          ></div>
        </div>

        {currentStep === 0 && <MorningGreeting onNext={handleNextStep} userName={user?.name || user?.email} />}

        {currentStep === 1 && (
          <MorningWhyReminder bigGoal={bigGoal} onNext={handleNextStep} onBack={handlePrevStep} />
        )}

        {currentStep === 2 && (
          <MorningGratitude
            value={gratitudeThings}
            onChange={setGratitudeThings}
            onNext={handleNextStep}
            onBack={handlePrevStep}
          />
        )}

        {currentStep === 3 && (
          <MorningGoalSetter
            value={dailyGoals}
            onChange={setDailyGoals}
            onNext={handleNextStep}
            onBack={handlePrevStep}
          />
        )}

        {currentStep === 4 && (
          <MorningMotivation onStart={handleRoutineComplete} onBack={handlePrevStep} />
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
