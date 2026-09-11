'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ChatWidget() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat Bubble Button */}
      <button
        onClick={() => {
          if (isOpen) {
            router.push('/chat');
          } else {
            setIsOpen(true);
          }
        }}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-full shadow-lg flex items-center justify-center text-white text-2xl transition-all z-50"
        title="Chat with Ronnie"
      >
        💬
      </button>

      {/* Mini Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col max-h-96">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-bold">Ronnie</h3>
              <p className="text-xs text-purple-100">Your AI Coach</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-purple-100 text-xl"
            >
              ×
            </button>
          </div>

          {/* Quick Messages */}
          <div className="flex-1 p-4 space-y-2 overflow-y-auto">
            <div className="text-sm text-gray-600">
              <p className="mb-3">Hi there! 👋 How can I help you today?</p>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-xs bg-purple-50 text-purple-700 hover:bg-purple-100 rounded transition">
                  ✨ Get motivated
                </button>
                <button className="w-full text-left px-3 py-2 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 rounded transition">
                  🎯 What should I do next?
                </button>
                <button className="w-full text-left px-3 py-2 text-xs bg-green-50 text-green-700 hover:bg-green-100 rounded transition">
                  💡 Tell me about my goals
                </button>
              </div>
            </div>
          </div>

          {/* Open Full Chat Button */}
          <div className="border-t border-gray-200 p-3">
            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/chat');
              }}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded transition"
            >
              Open Full Chat
            </button>
          </div>
        </div>
      )}
    </>
  );
}
