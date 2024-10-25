import React from 'react';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Message as MessageType } from '../types';

interface MessageProps {
  message: MessageType;
}

export default function Message({ message }: MessageProps) {
  const Icon = message.role === 'assistant' ? Bot : User;

  return (
    <div className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        message.role === 'assistant' 
          ? 'bg-gradient-to-r from-blue-500 to-indigo-500' 
          : 'bg-gray-500'
      }`}>
        <Icon size={20} className="text-white" />
      </div>
      
      <div className={`max-w-[70%] rounded-lg p-3 ${
        message.role === 'assistant'
          ? 'bg-white dark:bg-gray-800 border dark:border-gray-700'
          : 'bg-blue-500 text-white'
      }`}>
        <ReactMarkdown
          className={`prose ${message.role === 'user' ? 'prose-invert' : 'dark:prose-invert'} max-w-none`}
        >
          {message.content}
        </ReactMarkdown>
        <div className="mt-1 text-xs opacity-70">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}