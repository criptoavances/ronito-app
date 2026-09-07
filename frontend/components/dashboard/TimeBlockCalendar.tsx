export default function TimeBlockCalendar({ blocks }) {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Schedule</h2>
        <p className="text-gray-600 text-sm">Set up your time blocks in onboarding or settings.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Schedule</h2>

      <div className="space-y-2">
        {blocks.map((block, idx) => (
          <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div
              className="w-4 h-full rounded flex-shrink-0"
              style={{ backgroundColor: block.color, height: '2rem' }}
            />
            <div className="flex-1">
              <p className="font-medium text-gray-800">{block.name}</p>
              <p className="text-xs text-gray-500">
                {block.start_time} - {block.end_time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-900">
          💡 Time blocks help protect focus time. Drag tasks here to schedule them.
        </p>
      </div>
    </div>
  );
}
