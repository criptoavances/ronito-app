'use client';

interface EveningGreetingProps {
  userName?: string;
  onNext: () => void;
}

export default function EveningGreeting({ userName, onNext }: EveningGreetingProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">Good Evening 🌙</h2>
      <p className="text-xl text-gray-600 mb-6">
        {userName ? `Welcome back, ${userName}` : 'Welcome back'}
      </p>
      <p className="text-gray-600 mb-8">
        Let's reflect on today and prepare for tomorrow.
      </p>
      <button
        onClick={onNext}
        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition"
      >
        Begin Reflection →
      </button>
    </div>
  );
}
