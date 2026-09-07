'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { api } from '../../lib/api';

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [settings, setSettings] = useState({
    why_reminder_frequency: '1h',
    ai_voice_choice: 'nova',
    morning_routine_enabled: true,
    evening_routine_enabled: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSettings();
    }
  }, [isAuthenticated]);

  const fetchSettings = async () => {
    try {
      const response = await api.settings.get();
      if (response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.settings.update(settings);
      setSaveMessage('Settings saved!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveMessage('Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">⚙️ Settings</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            ← Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Account Section */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Account</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={user?.name || ''}
                disabled
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Account settings (password, email change) coming soon.
            </p>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Preferences</h2>

          <div className="space-y-8">
            {/* WHY Reminder Frequency */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">WHY Reminder Frequency</h3>
              <p className="text-gray-600 text-sm mb-4">
                How often should your big goal be spoken to you throughout the day?
              </p>
              <div className="space-y-2">
                {['30m', '1h', '2h'].map((freq) => (
                  <label key={freq} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="frequency"
                      value={freq}
                      checked={settings.why_reminder_frequency === freq}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          why_reminder_frequency: e.target.value,
                        })
                      }
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="ml-3 text-gray-800">
                      Every {freq === '30m' ? '30 minutes' : freq === '1h' ? 'hour' : '2 hours'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* AI Voice */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">AI Voice</h3>
              <p className="text-gray-600 text-sm mb-4">
                Which voice would you like to hear?
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'nova', name: 'Nova (Female, Warm)' },
                  { id: 'alloy', name: 'Alloy (Male, Friendly)' },
                  { id: 'echo', name: 'Echo (Male, Deep)' },
                  { id: 'fable', name: 'Fable (Female, Energetic)' },
                ].map((voice) => (
                  <label key={voice.id} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="voice"
                      value={voice.id}
                      checked={settings.ai_voice_choice === voice.id}
                      onChange={(e) =>
                        setSettings({ ...settings, ai_voice_choice: e.target.value })
                      }
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="ml-3 text-sm text-gray-800">{voice.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Routines */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Daily Routines</h3>
              <p className="text-gray-600 text-sm mb-4">
                Enable or disable your morning and evening reflections.
              </p>
              <div className="space-y-3">
                <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={settings.morning_routine_enabled}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        morning_routine_enabled: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span className="ml-3 text-gray-800">
                    Morning routine (gratitude + goal setting)
                  </span>
                </label>

                <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={settings.evening_routine_enabled}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        evening_routine_enabled: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span className="ml-3 text-gray-800">
                    Evening routine (reflection + journaling)
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between">
          <div>
            {saveMessage && (
              <p
                className={`text-sm font-medium ${
                  saveMessage.includes('saved') ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {saveMessage}
              </p>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </main>
    </div>
  );
}
