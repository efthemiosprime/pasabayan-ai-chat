'use client';

import { useState, useEffect } from 'react';
import { Bot, LogIn, Shield, Code, User, ChevronDown, FlaskConical } from 'lucide-react';
import { ChatWindow } from '@/components/ChatWindow';
import { healthCheck } from '@/lib/api';

type AppMode = 'user' | 'admin' | 'developer' | 'qa';

export default function HomePage() {
  const [token, setToken] = useState<string | null>(null);
  const [mode, setMode] = useState<AppMode>('user');
  const [tokenInput, setTokenInput] = useState('');
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [showModeMenu, setShowModeMenu] = useState(false);

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

  const handleLogin = (selectedMode: 'admin' | 'developer') => {
    if (tokenInput.trim()) {
      setToken(tokenInput.trim());
      setMode(selectedMode);
      setShowTokenInput(false);
      setTokenInput('');
    }
  };

  const handleLogout = () => {
    setToken(null);
    setMode('user');
    setShowModeMenu(false);
  };

  const handleModeChange = (newMode: AppMode) => {
    if (newMode === 'user') {
      handleLogout();
    } else {
      setMode(newMode);
    }
    setShowModeMenu(false);
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'developer': return <Code className="w-4 h-4" />;
      case 'qa': return <FlaskConical className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getModeLabel = () => {
    switch (mode) {
      case 'admin': return 'Admin';
      case 'developer': return 'Developer';
      case 'qa': return 'QA';
      default: return 'User';
    }
  };

  const getModeColor = () => {
    switch (mode) {
      case 'admin': return 'bg-amber-100 text-amber-800';
      case 'developer': return 'bg-purple-100 text-purple-800';
      case 'qa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between safe-area-top">
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
          {/* Mode selector - always visible */}
          <div className="relative">
            <button
              onClick={() => setShowModeMenu(!showModeMenu)}
              className={`flex items-center gap-2 px-3 py-1.5 ${getModeColor()} rounded-full text-sm`}
            >
              {getModeIcon()}
              {getModeLabel()}
              <ChevronDown className="w-3 h-3" />
            </button>

            {showModeMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[160px] z-50">
                <button
                  onClick={() => handleModeChange('user')}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 ${mode === 'user' ? 'text-gray-900 bg-gray-50' : 'text-gray-700'}`}
                >
                  <User className="w-4 h-4" />
                  User Mode
                </button>
                <button
                  onClick={() => { setMode('qa'); setToken(null); setShowModeMenu(false); }}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 ${mode === 'qa' ? 'text-green-700 bg-green-50' : 'text-gray-700'}`}
                >
                  <FlaskConical className="w-4 h-4" />
                  QA Mode
                </button>
                <div className="border-t border-gray-100 my-1" />
                {token ? (
                  <>
                    <button
                      onClick={() => handleModeChange('admin')}
                      className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 ${mode === 'admin' ? 'text-amber-700 bg-amber-50' : 'text-gray-700'}`}
                    >
                      <Shield className="w-4 h-4" />
                      Admin Mode
                    </button>
                    <button
                      onClick={() => handleModeChange('developer')}
                      className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 ${mode === 'developer' ? 'text-purple-700 bg-purple-50' : 'text-gray-700'}`}
                    >
                      <Code className="w-4 h-4" />
                      Developer Mode
                    </button>
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogIn className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { setShowTokenInput(true); setShowModeMenu(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <LogIn className="w-4 h-4" />
                    Login (Admin/Dev)
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Token input modal */}
      {showTokenInput && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Login
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Enter your API token and select a mode.
            </p>
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="API Token"
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
                onClick={() => handleLogin('developer')}
                disabled={!tokenInput.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                <Code className="w-4 h-4" />
                Developer
              </button>
              <button
                onClick={() => handleLogin('admin')}
                disabled={!tokenInput.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors"
              >
                <Shield className="w-4 h-4" />
                Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat window */}
      <main className="flex-1 overflow-hidden">
        <ChatWindow
          adminToken={mode === 'admin' ? token || undefined : undefined}
          developerToken={mode === 'developer' ? token || undefined : undefined}
          qaMode={mode === 'qa'}
        />
      </main>
    </div>
  );
}
