export default function SettingsStep({ value, onChange }) {
  const voiceOptions = [
    { id: 'nova', name: 'Nova (Female, Warm)' },
    { id: 'alloy', name: 'Alloy (Male, Friendly)' },
    { id: 'echo', name: 'Echo (Male, Deep)' },
    { id: 'fable', name: 'Fable (Female, Energetic)' },
  ];

  const frequencyOptions = [
    { id: '30m', name: 'Every 30 minutes' },
    { id: '1h', name: 'Every 1 hour' },
    { id: '2h', name: 'Every 2 hours' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Preferences</h2>
      <p className="text-gray-600 mb-6">
        Customize how RONITO interacts with you.
      </p>

      <div className="space-y-6">
        {/* WHY Reminder Frequency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            WHY Reminder Frequency
          </label>
          <p className="text-sm text-gray-500 mb-3">
            How often should you hear your WHY throughout the day?
          </p>
          <div className="space-y-2">
            {frequencyOptions.map((option) => (
              <label key={option.id} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="frequency"
                  value={option.id}
                  checked={value.why_reminder_frequency === option.id}
                  onChange={(e) =>
                    onChange({ ...value, why_reminder_frequency: e.target.value })
                  }
                  className="w-4 h-4 text-purple-600"
                />
                <span className="ml-3 text-gray-800">{option.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* AI Voice Choice */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            AI Voice
          </label>
          <p className="text-sm text-gray-500 mb-3">
            Which voice would you like to hear?
          </p>
          <div className="grid grid-cols-2 gap-3">
            {voiceOptions.map((option) => (
              <label key={option.id} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="voice"
                  value={option.id}
                  checked={value.ai_voice_choice === option.id}
                  onChange={(e) =>
                    onChange({ ...value, ai_voice_choice: e.target.value })
                  }
                  className="w-4 h-4 text-purple-600"
                />
                <span className="ml-3 text-sm text-gray-800">{option.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Routine Toggles */}
        <div className="space-y-3">
          <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={value.morning_routine_enabled}
              onChange={(e) =>
                onChange({ ...value, morning_routine_enabled: e.target.checked })
              }
              className="w-4 h-4 text-purple-600 rounded"
            />
            <span className="ml-3 text-gray-800">Enable morning routine (gratitude + goal setting)</span>
          </label>

          <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={value.evening_routine_enabled}
              onChange={(e) =>
                onChange({ ...value, evening_routine_enabled: e.target.checked })
              }
              className="w-4 h-4 text-purple-600 rounded"
            />
            <span className="ml-3 text-gray-800">Enable evening routine (reflection + journaling)</span>
          </label>
        </div>
      </div>

      <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <p className="text-sm text-purple-900">
          ✨ You can change these settings anytime. They're meant to support you, not constrain you.
        </p>
      </div>
    </div>
  );
}
