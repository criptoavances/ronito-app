'use client';

interface EveningGratitudeProps {
  onNext: () => void;
  onBack: () => void;
}

export default function EveningGratitude({ onNext, onBack }: EveningGratitudeProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Three Good Things</h2>
      <p className="text-gray-600 mb-6">What are 3 things you're grateful for today?</p>

      <div className="space-y-4 mb-8">
        {[1, 2, 3].map((num) => (
          <div key={num}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thing #{num}
            </label>
            <textarea
              placeholder="Something you're grateful for..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={2}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
