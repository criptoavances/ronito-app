'use client';

import { useState } from 'react';

interface EveningTomorrowProps {
  onComplete: () => void;
  onBack: () => void;
}

export default function EveningTomorrow({ onComplete, onBack }: EveningTomorrowProps) {
  const [goals, setGoals] = useState(['', '', '']);

  const handleGoalChange = (index: number, value: string) => {
    const newGoals = [...goals];
    newGoals[index] = value;
    setGoals(newGoals);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Tomorrow's Preview</h2>
      <p className="text-gray-600 mb-6">Set 3 intentions for tomorrow to start strong.</p>

      <div className="space-y-4 mb-8">
        {[0, 1, 2].map((index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Goal {index + 1}
            </label>
            <input
              type="text"
              value={goals[index]}
              onChange={(e) => handleGoalChange(index, e.target.value)}
              placeholder="What's your focus for tomorrow..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        ))}
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-8">
        <p className="text-sm text-indigo-800">
          ✨ Sleep well tonight. You did good work today. Tomorrow is a fresh start.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition"
        >
          ← Back
        </button>
        <button
          onClick={onComplete}
          className="flex-1 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
        >
          Complete & Rest 🌙
        </button>
      </div>
    </div>
  );
}
