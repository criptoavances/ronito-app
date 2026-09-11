'use client';

interface EveningReflectionProps {
  onNext: () => void;
  onBack: () => void;
}

export default function EveningReflection({ onNext, onBack }: EveningReflectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Today's Summary</h2>

      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What went well today?
          </label>
          <textarea
            placeholder="Write what you're proud of..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What could be better?
          </label>
          <textarea
            placeholder="What would you do differently..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Any insights or lessons?
          </label>
          <textarea
            placeholder="What did you learn today..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={3}
          />
        </div>
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
