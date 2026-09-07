export default function TimeBlocksStep({ values, onChange }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Daily Time Blocks</h2>
      <p className="text-gray-600 mb-6">
        Create your ideal daily schedule. These blocks help you protect focus time and stay balanced.
      </p>

      <div className="space-y-4">
        {values.map((block, idx) => (
          <div key={idx} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-6 h-6 rounded"
                style={{ backgroundColor: block.color }}
              />
              <span className="font-medium text-gray-800">{block.name}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="time"
                  value={block.start_time}
                  onChange={(e) => {
                    const newValues = [...values];
                    newValues[idx].start_time = e.target.value;
                    onChange(newValues);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input
                  type="time"
                  value={block.end_time}
                  onChange={(e) => {
                    const newValues = [...values];
                    newValues[idx].end_time = e.target.value;
                    onChange(newValues);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-pink-50 rounded-lg border border-pink-200">
        <p className="text-sm text-pink-900">
          ⏰ These times are flexible. You can adjust them anytime. They help structure your day.
        </p>
      </div>
    </div>
  );
}
