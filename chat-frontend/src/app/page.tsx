'use client';

import { useState, useEffect } from 'react';
import { Bot, LogIn, Shield } from 'lucide-react';
import { ChatWindow } from '@/components/ChatWindow';
import { healthCheck } from '@/lib/api';

export default function HomePage() {
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState('');
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [showTokenInput, setShowTokenInput] = useState(false);

  // Check backend health on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const health = await healthCheck();
        setIsConnected(health.status === 'ok');
      } catch {
        setIsConnected(false);
      }
    };
    checkHealth();
  }, []);

  const handleLogin = () => {
    if (tokenInput.trim()) {
      setAdminToken(tokenInput.trim());
      setShowTokenInput(false);
      setTokenInput('');
    }
  };

  const handleLogout = () => {
    setAdminToken(null);
  };

  if (isConnected === false) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-800 mb-2">
            Connection Error
          </h1>
          <p className="text-gray-600 mb-4">
            Unable to connect to the chat backend.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Top navigation */}
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">Pasabayan Assistant</h1>
            <p className="text-xs text-gray-500">
              {isConnected === null
                ? 'Connecting...'
                : isConnected
                  ? 'Connected'
                  : 'Disconnected'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {adminToken ? (
            <>
              <span className="flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm">
                <Shield className="w-4 h-4" />
                Admin
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg text-sm transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowTokenInput(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg text-sm transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Admin Login
            </button>
          )}
        </div>
      </header>

      {/* Admin token input modal */}
      {showTokenInput && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Admin Login
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Enter your admin API token to access full platform features.
            </p>
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Admin API Token"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowTokenInput(false);
                  setTokenInput('');
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogin}
                disabled={!tokenInput.trim()}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat window */}
      <main className="flex-1 overflow-hidden">
        <ChatWindow adminToken={adminToken || undefined} />
      </main>
    </div>
  );
}
