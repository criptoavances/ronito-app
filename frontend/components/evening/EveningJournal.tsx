'use client';

interface EveningJournalProps {
  onNext: () => void;
  onBack: () => void;
}

export default function EveningJournal({ onNext, onBack }: EveningJournalProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Evening Journal</h2>
      <p className="text-gray-600 mb-6">Write freely. This is your space to process the day.</p>

      <div className="mb-8">
        <textarea
          placeholder="What's on your mind? Any thoughts, feelings, or observations from today?"
          className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
          rows={8}
        />
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
