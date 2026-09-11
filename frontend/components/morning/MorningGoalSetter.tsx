'use client';

import React, { useState } from 'react';

interface MorningGoalSetterProps {
  onNext: () => void;
  onBack: () => void;
  onChange: (goals: string[]) => void;
  value?: string[];
}

export default function MorningGoalSetter({
  onNext,
  onBack,
  onChange,
  value = ['', '', ''],
}: MorningGoalSetterProps) {
  const [goals, setGoals] = useState(value);

  const handleChange = (idx: number, val: string) => {
    const newGoals = [...goals];
    newGoals[idx] = val;
    setGoals(newGoals);
    onChange(newGoals);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Pick 3 Goals for Today</h2>
      <p className="text-gray-600 mb-6">Non-negotiable. Focus on these.</p>

      <div className="space-y-4 mb-6">
        {[0, 1, 2].map((idx) => (
          <div key={idx}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Goal {idx + 1}
            </label>
            <input
              type="text"
              value={goals[idx]}
              onChange={(e) => handleChange(idx, e.target.value)}
              placeholder={`e.g., ${idx === 0 ? 'Finish project X' : idx === 1 ? 'Exercise 30min' : 'Read 20 pages'}`}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 border border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
