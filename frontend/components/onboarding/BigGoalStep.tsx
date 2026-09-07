export default function BigGoalStep({ value, onChange }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Big Goal - The WHY</h2>
      <p className="text-gray-600 mb-6">
        This is your north star. The one thing that matters most to you. Everything else flows from this.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">What's your big goal?</label>
          <input
            type="text"
            value={value.title}
            onChange={(e) => onChange({ ...value, title: e.target.value })}
            placeholder="e.g., Build a thriving, healthy family"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Why does this matter?</label>
          <textarea
            value={value.why}
            onChange={(e) => onChange({ ...value, why: e.target.value })}
            placeholder="Describe why this goal is important to you. This becomes your reminder when things get hard."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <p className="text-sm text-purple-900">
          💡 Your WHY will be spoken to you throughout the day. Make it emotionally powerful, not just a task.
        </p>
      </div>
    </div>
  );
}
