'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { api } from '../../lib/api';

interface Goal {
  id: string;
  title: string;
  level: string;
  completed: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, logout, isAuthenticated } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [goalsLoading, setGoalsLoading] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchGoals();
    }
  }, [isAuthenticated]);

  const fetchGoals = async () => {
    setGoalsLoading(true);
    const response = await api.goals.list();
    if (response.data) {
      setGoals(Array.isArray(response.data) ? (response.data as Goal[]) : []);
    }
    setGoalsLoading(false);
  };

  const addGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;

    const response = await api.goals.create({
      title: newGoalTitle,
      level: 'daily',
      completed: false,
    });

    if (response.data && typeof response.data === 'object' && 'id' in response.data) {
      setGoals([...goals, response.data as Goal]);
      setNewGoalTitle('');
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
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-purple-600">RONITO</h1>
            <p className="text-gray-600 text-sm">Welcome, {user?.name || user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Today's Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Today's Goals</h3>
            <p className="text-3xl font-bold text-purple-600">3</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Completed</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Streak</h3>
            <p className="text-3xl font-bold text-blue-600">7 days</p>
          </div>
        </div>

        {/* Goals Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Daily Goals</h2>

          <form onSubmit={addGoal} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                placeholder="Add a new goal..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg"
              >
                Add
              </button>
            </div>
          </form>

          {goalsLoading ? (
            <p className="text-gray-600">Loading goals...</p>
          ) : goals.length === 0 ? (
            <p className="text-gray-600">No goals yet. Create one to get started!</p>
          ) : (
            <ul className="space-y-2">
              {goals.map((goal) => (
                <li
                  key={goal.id}
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <input
                    type="checkbox"
                    checked={goal.completed}
                    className="w-5 h-5 text-purple-600 rounded"
                    readOnly
                  />
                  <span
                    className={`ml-3 ${
                      goal.completed ? 'line-through text-gray-400' : 'text-gray-800'
                    }`}
                  >
                    {goal.title}
                  </span>
                  <span className="ml-auto text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                    {goal.level}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
