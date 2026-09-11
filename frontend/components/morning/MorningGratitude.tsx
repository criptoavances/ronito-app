'use client';

import React, { useState } from 'react';

interface MorningGratitudeProps {
  onNext: () => void;
  onBack: () => void;
  onChange: (items: string[]) => void;
  value?: string[];
}

export default function MorningGratitude({
  onNext,
  onBack,
  onChange,
  value = ['', '', ''],
}: MorningGratitudeProps) {
  const [gratitude, setGratitude] = useState(value);

  const handleChange = (idx: number, val: string) => {
    const newGratitude = [...gratitude];
    newGratitude[idx] = val;
    setGratitude(newGratitude);
    onChange(newGratitude);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">What Are You Grateful For?</h2>
      <p className="text-gray-600 mb-6">Share 3 things, big or small.</p>

      <div className="space-y-4 mb-6">
        {[0, 1, 2].map((idx) => (
          <div key={idx}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thing {idx + 1}
            </label>
            <input
              type="text"
              value={gratitude[idx]}
              onChange={(e) => handleChange(idx, e.target.value)}
              placeholder={`e.g., ${idx === 0 ? 'My family' : idx === 1 ? 'Good health' : 'This sunny day'}`}
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
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
