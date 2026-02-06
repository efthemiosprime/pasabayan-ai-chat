'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Loader2, Plus, Trash2, Lightbulb } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { SuggestionsPanel } from './SuggestionsPanel';
import { sendMessage, newConversation } from '@/lib/api';
import type { Message } from '@/lib/types';

interface ChatWindowProps {
  adminToken?: string;
  developerToken?: string;
}

export function ChatWindow({ adminToken, developerToken }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  // Handle mobile keyboard - adjust layout when keyboard appears
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined' && window.visualViewport) {
        const viewport = window.visualViewport;
        const keyboardH = window.innerHeight - viewport.height;
        setKeyboardHeight(keyboardH > 0 ? keyboardH : 0);

        // Scroll to bottom when keyboard opens
        if (keyboardH > 0) {
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    };

    const viewport = typeof window !== 'undefined' ? window.visualViewport : null;

    if (viewport) {
      viewport.addEventListener('resize', handleResize);
      viewport.addEventListener('scroll', handleResize);
    }

    // Also handle focus events for iOS
    const handleFocus = () => {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    };

    const textarea = inputRef.current;
    textarea?.addEventListener('focus', handleFocus);

    return () => {
      if (viewport) {
        viewport.removeEventListener('resize', handleResize);
        viewport.removeEventListener('scroll', handleResize);
      }
      textarea?.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendMessage(userMessage.content, {
        conversationId: conversationId || undefined,
        adminToken,
        developerToken,
      });

      setConversationId(response.conversationId);

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        toolsUsed: response.toolsUsed,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = async () => {
    try {
      const response = await newConversation({ adminToken, developerToken });
      setConversationId(response.conversationId);
      setMessages([]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create conversation');
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setConversationId(null);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSelectSuggestion = (query: string) => {
    setInput(query);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full chat-container"
      style={{ paddingBottom: keyboardHeight > 0 ? `${keyboardHeight}px` : undefined }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            {developerToken ? '🛠️ Developer Mode' : adminToken ? '🔐 Admin Mode' : '👤 User Mode'}
          </span>
          {conversationId && (
            <span className="text-xs text-gray-400">
              #{conversationId.slice(0, 8)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleNewChat}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="New conversation"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            onClick={handleClearChat}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Clear chat"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <SuggestionsPanel
            onSelectQuery={handleSelectSuggestion}
            isAdmin={!!adminToken}
            isDeveloper={!!developerToken}
          />
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                  <span className="text-gray-500">Thinking...</span>
                </div>
              </div>
            )}
            {showSuggestions && (
              <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-600">Need help? Try asking:</span>
                  <button
                    onClick={() => setShowSuggestions(false)}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    Hide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(!!adminToken ? [
                    'Show platform statistics',
                    'Find user by email',
                    'Show active deliveries',
                    'What are the popular routes?',
                  ] : [
                    'How does payment work?',
                    'What\'s the cancellation policy?',
                    'Is it safe to meet carriers?',
                    'How do I track my delivery?',
                  ]).map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error display */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-white border-t chat-input-wrapper safe-area-bottom">
        <div className="flex items-end gap-3">
          {messages.length > 0 && (
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className={`p-3 rounded-xl transition-colors ${
                showSuggestions
                  ? 'bg-primary-100 text-primary-600'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              title="Show suggestions"
            >
              <Lightbulb className="w-5 h-5" />
            </button>
          )}
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about trips, packages, deliveries..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-400 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
