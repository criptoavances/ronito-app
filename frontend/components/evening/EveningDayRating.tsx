'use client';

import { useState } from 'react';

interface EveningDayRatingProps {
  onNext: () => void;
  onBack: () => void;
}

export default function EveningDayRating({ onNext, onBack }: EveningDayRatingProps) {
  const [rating, setRating] = useState<number | null>(null);

  const handleRate = (value: number) => {
    setRating(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Rate Your Day</h2>

      <div className="flex justify-center gap-4 mb-8">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <button
            key={num}
            onClick={() => handleRate(num)}
            className={`w-12 h-12 rounded-lg font-bold text-lg transition ${
              rating === num
                ? 'bg-indigo-600 text-white scale-110'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            {num}
          </button>
        ))}
      </div>

      {rating && (
        <div className="mb-8 text-center">
          <p className="text-lg text-gray-600">
            {rating <= 3 && "Rough day, but tomorrow's a new chance 💪"}
            {rating > 3 && rating <= 6 && "Mixed day with ups and downs 🌤️"}
            {rating > 6 && rating <= 8 && "Good day! You did well 👏"}
            {rating > 8 && "Excellent day! You crushed it 🎉"}
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!rating}
          className="flex-1 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
