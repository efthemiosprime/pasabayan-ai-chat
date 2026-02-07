'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User } from 'lucide-react';
import type { Message } from '@/lib/types';
import { MermaidDiagram } from './MermaidDiagram';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? 'bg-primary-600' : 'bg-gray-200'
        }`}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-gray-600" />
        )}
      </div>

      {/* Message content */}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-primary-600 text-white'
            : 'bg-white border border-gray-200 shadow-sm'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-headings:my-2 prose-img:rounded-lg prose-img:my-3">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                img: ({ src, alt }) => (
                  <img
                    src={src}
                    alt={alt || ''}
                    className="rounded-lg max-w-full h-auto my-3 border border-gray-200"
                    loading="lazy"
                  />
                ),
                // Code blocks with proper ASCII art support
                pre: ({ children }) => (
                  <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 my-3 overflow-x-auto text-xs sm:text-sm">
                    {children}
                  </pre>
                ),
                code: ({ className, children, ...props }) => {
                  const isInline = !className && typeof children === 'string' && !children.includes('\n');
                  if (isInline) {
                    return (
                      <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm" {...props}>
                        {children}
                      </code>
                    );
                  }

                  // Check if this is a mermaid code block
                  const isMermaid = className === 'language-mermaid';
                  const codeContent = String(children).replace(/\n$/, '');

                  if (isMermaid) {
                    return <MermaidDiagram chart={codeContent} />;
                  }

                  // Block code - preserve whitespace for ASCII diagrams
                  return (
                    <code
                      className="block font-mono text-xs sm:text-sm whitespace-pre leading-relaxed"
                      style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace' }}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                // Table styling
                table: ({ children }) => (
                  <div className="overflow-x-auto my-3">
                    <table className="min-w-full border-collapse text-sm">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-gray-100">{children}</thead>
                ),
                th: ({ children }) => (
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-700">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-gray-300 px-3 py-2 text-gray-600">
                    {children}
                  </td>
                ),
              }}
            >{message.content}</ReactMarkdown>
          </div>
        )}

        {/* Tools used indicator */}
        {message.toolsUsed && message.toolsUsed.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
            Used: {message.toolsUsed.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
}
