export default function IdeasFoldersStep({ values, onChange }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Idea Folders</h2>
      <p className="text-gray-600 mb-6">
        Set up folders for things you want to capture: books to read, business ideas, travel plans, etc.
      </p>

      <div className="space-y-4">
        {values.map((folder, idx) => (
          <div key={idx}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Folder {idx + 1}</label>
            <input
              type="text"
              value={folder}
              onChange={(e) => {
                const newValues = [...values];
                newValues[idx] = e.target.value;
                onChange(newValues);
              }}
              placeholder={`e.g., ${idx === 0 ? 'Books to Read' : idx === 1 ? 'Business Ideas' : 'Travel Plans'}`}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-900">
            💡 Folders help you organize quick captures via voice or text. You can add more folders later.
          </p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            🎤 Later, you'll be able to say "add to books to read" and it captures your idea.
          </p>
        </div>
      </div>
    </div>
  );
}
