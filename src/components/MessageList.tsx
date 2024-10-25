import React from 'react';
import { format } from 'date-fns';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';

interface MessageListProps {
  messages: Message[];
  isTyping?: boolean;
}

export default function MessageList({ messages, isTyping = false }: MessageListProps) {
  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`flex items-start max-w-[70%] gap-3 ${
            message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.sender === 'user' 
                ? 'bg-blue-500' 
                : 'bg-gradient-to-r from-indigo-500 to-purple-500'
            }`}>
              {message.sender === 'user' ? (
                <User className="text-white" size={16} />
              ) : (
                <Bot className="text-white" size={16} />
              )}
            </div>
            <div className={`rounded-2xl px-4 py-2 shadow-sm ${
              message.sender === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
            }`}>
              <ReactMarkdown 
                className={`prose ${message.sender === 'user' ? 'prose-invert' : 'dark:prose-invert'} max-w-none`}
              >
                {message.content}
              </ReactMarkdown>
              <div className="mt-1 text-xs opacity-70">
                {format(message.timestamp, 'HH:mm')}
              </div>
            </div>
          </div>
        </div>
      ))}
      {isTyping && (
        <div className="flex justify-start">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full px-4 py-2 border border-gray-200 dark:border-gray-700">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          </div>
        </div>
      )}
    </div>
  );
}