'use client';

import React from 'react';

interface MorningMotivationProps {
  onStart: () => void;
  onBack: () => void;
}

export default function MorningMotivation({ onStart, onBack }: MorningMotivationProps) {
  const motivations = [
    '🚀 You are capable of amazing things.',
    '💪 Every action today brings you closer to your goals.',
    '✨ Your potential is limitless.',
    '🎯 Focus on what matters. Ignore the rest.',
    '🔥 Today is your day to shine.',
  ];

  const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">You're Ready</h2>

      <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-lg border-l-4 border-purple-600 mb-6">
        <p className="text-lg text-gray-800 font-semibold text-center">{randomMotivation}</p>
      </div>

      <p className="text-gray-600 text-center mb-6">
        You've set your goals. You know your why. Now go make it happen.
      </p>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 border border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={onStart}
          className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg transition"
        >
          Start Your Day! 🌟
        </button>
      </div>
    </div>
  );
}
