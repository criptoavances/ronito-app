'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { api } from '../../lib/api';

export default function CalendarPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dailyGoals, setDailyGoals] = useState<Record<string, Array<{id: string; title: string; completed: boolean}>>>({});

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMonthGoals();
    }
  }, [isAuthenticated, currentDate]);

  const fetchMonthGoals = async () => {
    try {
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const goals = {};
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const response = await api.goals.daily.list(dateStr);
        if (response.data) {
          goals[dateStr] = response.data;
        }
      }
      setDailyGoals(goals);
    } catch (error) {
      console.error('Failed to fetch month goals:', error);
    }
  };

  if (loading || !isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const goalsForDay = (day: number | null) => {
    if (!day) return [];
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      .toISOString()
      .split('T')[0];
    return dailyGoals[dateStr] || [];
  };

  const completionPercent = (day: number | null) => {
    const goals = goalsForDay(day);
    if (goals.length === 0) return 0;
    return (goals.filter((g: {completed: boolean}) => g.completed).length / goals.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">📅 Calendar</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            ← Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          {/* Month Navigation */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() =>
                setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
              }
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
            >
              ← Previous
            </button>
            <h2 className="text-2xl font-bold text-gray-800">{monthName}</h2>
            <button
              onClick={() =>
                setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
              }
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
            >
              Next →
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-semibold text-gray-700 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, idx) => (
              <div
                key={idx}
                className={`p-3 min-h-24 rounded-lg border-2 cursor-pointer transition ${
                  day
                    ? 'bg-gray-50 border-gray-200 hover:border-blue-600 hover:bg-blue-50'
                    : 'border-transparent'
                }`}
              >
                {day && (
                  <div onClick={() => router.push(`/day/${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`)}>
                    <p className="font-bold text-gray-800 mb-2">{day}</p>
                    <div className="space-y-1">
                      {goalsForDay(day).slice(0, 2).map((goal, i) => (
                        <div key={i} className="text-xs text-gray-600 truncate">
                          {goal.completed ? '✓' : '○'} {goal.title}
                        </div>
                      ))}
                      {goalsForDay(day).length > 2 && (
                        <p className="text-xs text-gray-500">
                          +{goalsForDay(day).length - 2} more
                        </p>
                      )}
                    </div>
                    {goalsForDay(day).length > 0 && (
                      <div className="mt-2 w-full bg-gray-300 rounded-full h-1">
                        <div
                          className="bg-blue-600 h-1 rounded-full transition-all"
                          style={{ width: `${completionPercent(day)}%` }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">
              💡 Click any day to see full goal details. Progress bars show completion for that day.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
