import { useState } from 'react';

export default function GoalHierarchy({ yearly, monthly, weekly, onRefresh }) {
  const [expandedYear, setExpandedYear] = useState(yearly.length > 0 ? yearly[0]?.id : null);
  const [expandedMonth, setExpandedMonth] = useState(null);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Goal Hierarchy</h2>

      <div className="space-y-4">
        {/* Yearly Goals */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">This Year</h3>
          <div className="space-y-2 ml-4">
            {yearly.length === 0 ? (
              <p className="text-gray-500 text-sm italic">No yearly goals set</p>
            ) : (
              yearly.map((goal) => (
                <div key={goal.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                  <div className="w-3 h-3 rounded-full bg-purple-600" />
                  <span className="text-gray-800 text-sm">{goal.title}</span>
                  <span className="ml-auto text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                    {goal.completed ? '✓' : 'In progress'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Monthly Goals */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">This Month</h3>
          <div className="space-y-2 ml-4">
            {monthly.length === 0 ? (
              <p className="text-gray-500 text-sm italic">No monthly goals set</p>
            ) : (
              monthly.map((goal) => (
                <div key={goal.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                  <div className="w-3 h-3 rounded-full bg-blue-600" />
                  <span className="text-gray-800 text-sm">{goal.title}</span>
                  <span className="ml-auto text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    {goal.completed ? '✓' : 'In progress'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Weekly Goals */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">This Week</h3>
          <div className="space-y-2 ml-4">
            {weekly.length === 0 ? (
              <p className="text-gray-500 text-sm italic">No weekly goals set</p>
            ) : (
              weekly.map((goal) => (
                <div key={goal.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                  <div className="w-3 h-3 rounded-full bg-green-600" />
                  <span className="text-gray-800 text-sm">{goal.title}</span>
                  <span className="ml-auto text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                    {goal.completed ? '✓' : 'In progress'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 p-3 bg-green-50 rounded-lg border border-green-200">
        <p className="text-xs text-green-900">
          🎯 Goals cascade: daily goals support weekly goals, weekly support monthly, etc.
        </p>
      </div>
    </div>
  );
}
