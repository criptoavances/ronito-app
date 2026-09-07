'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { api } from '../../lib/api';

export default function IdeasPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [newIdea, setNewIdea] = useState('');
  const [newFolder, setNewFolder] = useState('');
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFolders();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedFolderId) {
      fetchIdeas(selectedFolderId);
    }
  }, [selectedFolderId]);

  const fetchFolders = async () => {
    try {
      const response = await api.ideas.folders.list();
      setFolders(response.data || []);
      if ((response.data || []).length > 0) {
        setSelectedFolderId(response.data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch folders:', error);
    }
  };

  const fetchIdeas = async (folderId) => {
    try {
      const response = await api.ideas.list(folderId);
      setIdeas(response.data || []);
    } catch (error) {
      console.error('Failed to fetch ideas:', error);
    }
  };

  const handleAddFolder = async () => {
    if (!newFolder.trim()) return;
    try {
      await api.ideas.folders.create({ name: newFolder });
      setNewFolder('');
      setShowNewFolder(false);
      fetchFolders();
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  };

  const handleAddIdea = async () => {
    if (!newIdea.trim() || !selectedFolderId) return;
    setIsLoading(true);
    try {
      await api.ideas.create({
        folder_id: selectedFolderId,
        content: newIdea,
      });
      setNewIdea('');
      fetchIdeas(selectedFolderId);
    } catch (error) {
      console.error('Failed to add idea:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteIdea = async (ideaId) => {
    try {
      await api.ideas.delete(ideaId);
      fetchIdeas(selectedFolderId);
    } catch (error) {
      console.error('Failed to delete idea:', error);
    }
  };

  if (loading || !isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-yellow-600">💡 Ideas</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            ← Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Folders Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="font-bold text-gray-800 mb-4">Folders</h2>

              <div className="space-y-2 mb-4">
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolderId(folder.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      selectedFolderId === folder.id
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {folder.name}
                  </button>
                ))}
              </div>

              {showNewFolder ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newFolder}
                    onChange={(e) => setNewFolder(e.target.value)}
                    placeholder="Folder name..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddFolder}
                      className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium py-2 rounded-lg"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowNewFolder(false);
                        setNewFolder('');
                      }}
                      className="flex-1 border border-gray-300 text-gray-700 text-sm font-medium py-2 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowNewFolder(true)}
                  className="w-full border-2 border-dashed border-gray-300 text-gray-600 font-medium py-2 rounded-lg hover:border-yellow-600 hover:text-yellow-600"
                >
                  + New Folder
                </button>
              )}
            </div>
          </div>

          {/* Ideas List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {folders.find((f) => f.id === selectedFolderId)?.name || 'Select a folder'}
              </h2>

              {/* Add Idea Form */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newIdea}
                    onChange={(e) => setNewIdea(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddIdea()}
                    placeholder="Add an idea..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <button
                    onClick={handleAddIdea}
                    disabled={isLoading}
                    className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Ideas List */}
              {ideas.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No ideas yet. Add one to get started!</p>
              ) : (
                <div className="space-y-3">
                  {ideas.map((idea) => (
                    <div key={idea.id} className="flex items-start justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex-1">
                        <p className="text-gray-800">{idea.content}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(idea.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteIdea(idea.id)}
                        className="text-red-600 hover:text-red-800 font-medium ml-4"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
