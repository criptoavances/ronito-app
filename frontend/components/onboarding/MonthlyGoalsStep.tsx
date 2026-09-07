export default function MonthlyGoalsStep({ values, onChange }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Monthly Goals (This Month)</h2>
      <p className="text-gray-600 mb-6">
        Pick 3 milestones for this month. Break down your yearly goals into monthly chunks.
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
              placeholder={`e.g., ${idx === 0 ? 'Run 50km' : idx === 1 ? 'Finish 2 books' : 'Complete 10 lessons'}`}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <p className="text-sm text-green-900">
          🎯 Monthly goals should be specific and measurable. Celebrate when you hit them.
        </p>
      </div>
    </div>
  );
}
