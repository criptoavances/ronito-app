'use client';

import React from 'react';

interface MorningGreetingProps {
  onNext: () => void;
  userName?: string;
}

export default function MorningGreeting({ onNext, userName = 'Friend' }: MorningGreetingProps) {
  const hour = new Date().getHours();
  const getGreeting = () => {
    if (hour < 12) return '🌅 Good Morning';
    if (hour < 17) return '☀️ Good Afternoon';
    return '🌆 Good Evening';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-4">
      <div className="text-center space-y-6">
        <h2 className="text-5xl font-bold text-gray-800">{getGreeting()}</h2>
        <p className="text-2xl text-purple-600 font-semibold">{userName}!</p>
        <p className="text-gray-600 text-lg">
          Today is a fresh start. Let's make it intentional.
        </p>
        <button
          onClick={onNext}
          className="mt-8 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition"
        >
          Let's Begin →
        </button>
      </div>
    </div>
  );
}
