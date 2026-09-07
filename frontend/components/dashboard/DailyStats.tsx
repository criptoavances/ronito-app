export default function DailyStats({ stats }) {
  const completionPercent = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Completion */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-gray-600 text-sm font-semibold">Completion</h3>
          <span className="text-2xl font-bold text-purple-600">{Math.round(completionPercent)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">{stats.completed} of {stats.total} goals</p>
      </div>

      {/* Streak */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-600 text-sm font-semibold mb-2">Streak</h3>
        <p className="text-3xl font-bold text-green-600">{stats.streak}</p>
        <p className="text-xs text-gray-500 mt-2">consecutive days</p>
      </div>

      {/* Energy */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-600 text-sm font-semibold mb-2">Energy Level</h3>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`h-8 flex-1 rounded ${i <= 3 ? 'bg-green-500' : 'bg-gray-200'}`} />
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">Good</p>
      </div>
    </div>
  );
}
