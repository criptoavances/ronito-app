export default function WeeklyGoalsStep({ values, onChange }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Weekly Goals (This Week)</h2>
      <p className="text-gray-600 mb-6">
        3 non-negotiable goals for this week. Small, specific, achievable.
      </p>

      <div className="space-y-4">
        {values.map((goal, idx) => (
          <div key={idx}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Goal {idx + 1}</label>
            <input
              type="text"
              value={goal}
              onChange={(e) => {
                const newValues = [...values];
                newValues[idx] = e.target.value;
                onChange(newValues);
              }}
              placeholder={`e.g., ${idx === 0 ? 'Run 12km' : idx === 1 ? 'Finish Chapter 3' : 'Do 5 lessons'}`}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-sm text-yellow-900">
          🏃 Weekly goals are your 3 focus areas. Every day you'll pick which daily goals support these.
        </p>
      </div>
    </div>
  );
}
