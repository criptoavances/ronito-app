export default function YearlyGoalsStep({ values, onChange }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Yearly Goals</h2>
      <p className="text-gray-600 mb-6">
        Pick 3 big things you want to achieve this year. These ladder up to your WHY.
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
              placeholder={`e.g., ${idx === 0 ? 'Run a marathon' : idx === 1 ? 'Read 12 books' : 'Learn Spanish'}`}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-900">
          📅 Yearly goals should be ambitious but achievable. You'll break these down into monthly goals.
        </p>
      </div>
    </div>
  );
}
