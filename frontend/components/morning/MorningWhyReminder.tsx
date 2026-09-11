'use client';

import React from 'react';

interface MorningWhyReminderProps {
  bigGoal?: { title: string; why?: string } | null;
  onNext: () => void;
  onBack: () => void;
}

export default function MorningWhyReminder({ bigGoal, onNext, onBack }: MorningWhyReminderProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Why Today</h2>

      {bigGoal ? (
        <div className="space-y-4">
          <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-600">
            <p className="font-semibold text-gray-800">{bigGoal.title}</p>
            {bigGoal.why && <p className="text-gray-600 mt-2 italic">{bigGoal.why}</p>}
          </div>
          <p className="text-gray-600 text-center text-sm">
            This is your north star. Keep this in mind as you plan your day.
          </p>
        </div>
      ) : (
        <p className="text-gray-600">Set your big goal in onboarding to see it here.</p>
      )}

      <div className="flex gap-4 mt-6">
        <button
          onClick={onBack}
          className="flex-1 border border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
