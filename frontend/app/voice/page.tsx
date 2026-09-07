'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';

export default function VoicePage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  if (loading || !isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-purple-600">🎤 Voice Commands</h1>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Voice Control</h2>

          <div className="space-y-6">
            {/* Coming Soon Notice */}
            <div className="p-6 bg-purple-50 rounded-lg border-l-4 border-purple-600">
              <p className="text-lg font-semibold text-purple-900 mb-2">🚀 Coming Soon</p>
              <p className="text-gray-700 mb-4">
                Voice commands and voice capture are currently in development. Once enabled, you'll be able to:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="text-gray-700">
                  <span className="text-purple-600 font-semibold">Say "Hey RONITO"</span> to activate voice mode
                </li>
                <li className="text-gray-700">
                  <span className="text-purple-600 font-semibold">"Add to [folder name]"</span> to capture ideas
                </li>
                <li className="text-gray-700">
                  <span className="text-purple-600 font-semibold">"Set a goal"</span> to add tasks by voice
                </li>
                <li className="text-gray-700">
                  <span className="text-purple-600 font-semibold">"Play meditation"</span> to start sessions
                </li>
                <li className="text-gray-700">
                  <span className="text-purple-600 font-semibold">Your WHY reminders</span> spoken aloud throughout the day
                </li>
              </ul>
            </div>

            {/* Technical Details */}
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">How It Works</h3>
              <div className="space-y-3 text-gray-700">
                <p>
                  <span className="font-semibold">Input:</span> OpenAI Whisper API converts your speech to text in Spanish, English, and German
                </p>
                <p>
                  <span className="font-semibold">Processing:</span> Claude AI understands your command and executes the action
                </p>
                <p>
                  <span className="font-semibold">Output:</span> ElevenLabs text-to-speech reads responses aloud in your chosen voice
                </p>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">🔒 Your Privacy</h3>
              <p className="text-blue-900">
                All voice data is processed securely. Your recordings are never stored or shared. Only the transcribed text is used for commands.
              </p>
            </div>
          </div>

          {/* Settings Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => router.push('/settings')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg"
            >
              Go to Settings
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
