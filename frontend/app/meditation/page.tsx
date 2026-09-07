'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { api } from '../../lib/api';

export default function MeditationPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [tab, setTab] = useState('library');
  const [sessions, setSessions] = useState([]);
  const [libraryContent, setLibraryContent] = useState([]);
  const [newSession, setNewSession] = useState({ title: '', duration_minutes: 5, media_type: 'audio' });
  const [isLoading, setIsLoading] = useState(false);

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
    try {
      const [mySessions, library] = await Promise.all([
        api.meditation.list(),
        api.meditation.library(),
      ]);
      setSessions(mySessions.data || []);
      setLibraryContent(library.data || []);
    } catch (error) {
      console.error('Failed to fetch meditation data:', error);
    }
  };

  const handleAddSession = async () => {
    if (!newSession.title.trim()) return;
    setIsLoading(true);
    try {
      await api.meditation.create(newSession);
      setNewSession({ title: '', duration_minutes: 5, media_type: 'audio' });
      fetchData();
    } catch (error) {
      console.error('Failed to add session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || !isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-green-600">🧘 Meditation & Breathwork</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            ← Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setTab('library')}
            className={`px-6 py-3 font-medium border-b-2 transition ${
              tab === 'library'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Guided Library
          </button>
          <button
            onClick={() => setTab('mine')}
            className={`px-6 py-3 font-medium border-b-2 transition ${
              tab === 'mine'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            My Sessions
          </button>
          <button
            onClick={() => setTab('add')}
            className={`px-6 py-3 font-medium border-b-2 transition ${
              tab === 'add'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Upload
          </button>
        </div>

        {/* Library Tab */}
        {tab === 'library' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {libraryContent.map((session) => (
              <div key={session.id} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{session.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{session.duration_minutes} minutes</p>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg">
                  Start
                </button>
              </div>
            ))}
          </div>
        )}

        {/* My Sessions Tab */}
        {tab === 'mine' && (
          <div>
            {sessions.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-600 text-lg mb-4">No sessions uploaded yet</p>
                <p className="text-gray-500">Upload your own meditation or guided sessions</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions.map((session) => (
                  <div key={session.id} className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{session.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {session.duration_minutes} minutes • {session.media_type}
                    </p>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg text-sm">
                        Play
                      </button>
                      <button className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-medium py-2 rounded-lg text-sm">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Upload Tab */}
        {tab === 'add' && (
          <div className="bg-white rounded-lg shadow p-8 max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Meditation Session</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newSession.title}
                  onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                  placeholder="e.g., 10-Minute Morning Breathwork"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  value={newSession.duration_minutes}
                  onChange={(e) =>
                    setNewSession({
                      ...newSession,
                      duration_minutes: parseInt(e.target.value),
                    })
                  }
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={newSession.media_type}
                  onChange={(e) => setNewSession({ ...newSession, media_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="audio">Audio</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border-2 border-dashed border-green-300">
                <p className="text-gray-600 text-center">
                  📁 File upload coming soon<br/>
                  For now, use voice to record sessions
                </p>
              </div>

              <button
                onClick={handleAddSession}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Add Session'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
