'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { api } from '../../lib/api';
import GoalHierarchy from '../../components/dashboard/GoalHierarchy';
import TimeBlockCalendar from '../../components/dashboard/TimeBlockCalendar';
import DailyStats from '../../components/dashboard/DailyStats';
import QuickActions from '../../components/dashboard/QuickActions';
import ChatWidget from '../../components/ChatWidget';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, logout, isAuthenticated } = useAuth();
  const [bigGoal, setBigGoal] = useState<{title: string; why?: string} | null>(null);
  const [yearlyGoals, setYearlyGoals] = useState<Array<{id: string; title: string}>>([]);
  const [monthlyGoals, setMonthlyGoals] = useState<Array<{id: string; title: string}>>([]);
  const [weeklyGoals, setWeeklyGoals] = useState<Array<{id: string; title: string}>>([]);
  const [dailyGoals, setDailyGoals] = useState<Array<{id: string; title: string; completed: boolean}>>([]);
  const [timeBlocks, setTimeBlocks] = useState<Array<{id: string; name: string}>>([]);
  const [stats, setStats] = useState<{total: number; completed: number; streak: number}>({ total: 0, completed: 0, streak: 0 });
  const [goalsLoading, setGoalsLoading] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    setGoalsLoading(true);
    try {
      const [big, yearly, monthly, weekly, daily, blocks] = await Promise.all([
        api.goals.big.get(),
        api.goals.yearly.list(),
        api.goals.monthly.list(),
        api.goals.weekly.list(),
        api.goals.daily.list(),
        api.timeBlocks.list(),
      ]);

      setBigGoal((big?.data as {title: string; why?: string} | undefined) || null);
      setYearlyGoals((yearly.data as {id: string; title: string}[] | undefined) || []);
      setMonthlyGoals((monthly.data as {id: string; title: string}[] | undefined) || []);
      setWeeklyGoals((weekly.data as {id: string; title: string}[] | undefined) || []);
      setDailyGoals((daily.data as {id: string; title: string; completed: boolean}[] | undefined) || []);
      setTimeBlocks((blocks.data as {id: string; name: string}[] | undefined) || []);

      const completed = (daily.data || []).filter((g: {completed: boolean}) => g.completed).length;
      setStats({
        total: (daily.data || []).length,
        completed,
        streak: 7,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setGoalsLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <ChatWidget />
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-purple-600">RONITO</h1>
            <p className="text-gray-600 text-sm">Welcome, {user?.name || user?.email}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/chat')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg"
            >
              💬 Chat
            </button>
            <button
              onClick={() => router.push('/morning')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
            >
              🌅 Morning
            </button>
            <button
              onClick={() => router.push('/evening')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg"
            >
              🌙 Evening
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* BIG GOAL Banner */}
      {bigGoal && (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-2xl font-bold mb-2">Your Why</h2>
            <p className="text-lg">{bigGoal.title}</p>
            {bigGoal.why && <p className="text-purple-100 mt-2 italic">{bigGoal.why}</p>}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Goals Hierarchy */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <DailyStats stats={stats} />

            {/* Time Block Calendar */}
            <TimeBlockCalendar blocks={timeBlocks} />

            {/* Goal Hierarchy */}
            <GoalHierarchy
              yearly={yearlyGoals}
              monthly={monthlyGoals}
              weekly={weeklyGoals}
              onRefresh={fetchData}
            />
          </div>

          {/* Right Column: Daily Goals & Quick Actions */}
          <div className="space-y-6">
            {/* Today's Goals */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Goals (3)</h2>
              {goalsLoading ? (
                <p className="text-gray-600">Loading...</p>
              ) : dailyGoals.length === 0 ? (
                <p className="text-gray-600 text-sm">No goals set. Use the morning routine to set your 3 daily goals.</p>
              ) : (
                <div className="space-y-2">
                  {dailyGoals.map((goal) => (
                    <label key={goal.id} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={goal.completed}
                        onChange={async (e) => {
                          await api.goals.daily.update(goal.id, { completed: e.target.checked });
                          fetchData();
                        }}
                        className="w-5 h-5 text-purple-600 rounded"
                      />
                      <span className={`ml-3 ${goal.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {goal.title}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <QuickActions onAction={fetchData} />
          </div>
        </div>
      </main>
    </div>
  );
}
