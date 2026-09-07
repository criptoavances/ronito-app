import { useRouter } from 'next/navigation';

export default function QuickActions({ onAction }) {
  const router = useRouter();

  const actions = [
    { label: 'Morning Routine', icon: '🌅', href: '/morning', color: 'bg-blue-600' },
    { label: 'Evening Routine', icon: '🌙', href: '/evening', color: 'bg-indigo-600' },
    { label: 'Capture Idea', icon: '💡', href: '/ideas', color: 'bg-yellow-600' },
    { label: 'Meditate', icon: '🧘', href: '/meditation', color: 'bg-green-600' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Access</h2>

      <div className="space-y-3">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => router.push(action.href)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white font-medium ${action.color} hover:opacity-90 transition`}
          >
            <span className="text-lg">{action.icon}</span>
            <span>{action.label}</span>
            <span className="ml-auto">→</span>
          </button>
        ))}
      </div>

      <div className="mt-6 p-3 bg-purple-50 rounded-lg border border-purple-200">
        <p className="text-xs text-purple-900">
          🎤 Pro tip: Say "Hey RONITO" to voice-activate quick actions anywhere.
        </p>
      </div>
    </div>
  );
}
