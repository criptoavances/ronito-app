'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { api } from '../../lib/api';
import BigGoalStep from '../../components/onboarding/BigGoalStep';
import YearlyGoalsStep from '../../components/onboarding/YearlyGoalsStep';
import MonthlyGoalsStep from '../../components/onboarding/MonthlyGoalsStep';
import WeeklyGoalsStep from '../../components/onboarding/WeeklyGoalsStep';
import TimeBlocksStep from '../../components/onboarding/TimeBlocksStep';
import IdeasFoldersStep from '../../components/onboarding/IdeasFoldersStep';
import SettingsStep from '../../components/onboarding/SettingsStep';

export default function OnboardingPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Onboarding data state
  const [bigGoal, setBigGoal] = useState({ title: '', why: '' });
  const [yearlyGoals, setYearlyGoals] = useState(['', '', '']);
  const [monthlyGoals, setMonthlyGoals] = useState(['', '', '']);
  const [weeklyGoals, setWeeklyGoals] = useState(['', '', '']);
  const [timeBlocks, setTimeBlocks] = useState([
    { name: 'Work', color: '#8B5CF6', start_time: '09:00', end_time: '17:00', day_of_week: null },
    { name: 'Personal/Family', color: '#EC4899', start_time: '17:00', end_time: '20:00', day_of_week: null },
    { name: 'Exercise', color: '#10B981', start_time: '06:00', end_time: '07:00', day_of_week: null },
    { name: 'Catch-all', color: '#F59E0B', start_time: '20:00', end_time: '22:00', day_of_week: null },
  ]);
  const [ideaFolders, setIdeaFolders] = useState(['', '', '']);
  const [settings, setSettings] = useState({
    why_reminder_frequency: '1h',
    ai_voice_choice: 'nova',
    morning_routine_enabled: true,
    evening_routine_enabled: true,
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  const handleNext = () => {
    if (step < 7) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      // Save big goal
      if (bigGoal.title) {
        await api.goals.big.create(bigGoal);
      }

      // Save yearly goals
      for (const goal of yearlyGoals.filter((g) => g)) {
        await api.goals.yearly.create({ title: goal });
      }

      // Save monthly goals
      for (const goal of monthlyGoals.filter((g) => g)) {
        await api.goals.monthly.create({ title: goal });
      }

      // Save weekly goals
      for (const goal of weeklyGoals.filter((g) => g)) {
        await api.goals.weekly.create({ title: goal });
      }

      // Save time blocks
      for (const block of timeBlocks) {
        await api.timeBlocks.create(block);
      }

      // Create idea folders
      for (const folderName of ideaFolders.filter((f) => f)) {
        await api.ideas.folders.create({ name: folderName });
      }

      // Save settings
      await api.settings.update(settings);

      router.push('/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
      alert('Failed to complete onboarding. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const totalSteps = 7;
  const progressPercent = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-purple-600">Welcome to RONITO</h1>
          <p className="text-gray-600 text-sm mt-1">Let's set up your Daily Life OS</p>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {step} of {totalSteps}</span>
            <span className="text-sm font-medium text-gray-600">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          {step === 1 && <BigGoalStep value={bigGoal} onChange={setBigGoal} />}
          {step === 2 && <YearlyGoalsStep values={yearlyGoals} onChange={setYearlyGoals} />}
          {step === 3 && <MonthlyGoalsStep values={monthlyGoals} onChange={setMonthlyGoals} />}
          {step === 4 && <WeeklyGoalsStep values={weeklyGoals} onChange={setWeeklyGoals} />}
          {step === 5 && <TimeBlocksStep values={timeBlocks} onChange={setTimeBlocks} />}
          {step === 6 && <IdeasFoldersStep values={ideaFolders} onChange={setIdeaFolders} />}
          {step === 7 && <SettingsStep value={settings} onChange={setSettings} />}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>

          <div className="flex gap-4">
            {step < 7 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Setting up...' : 'Complete Setup'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
