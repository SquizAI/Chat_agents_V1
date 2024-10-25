import React, { useState, useRef } from 'react';
import { Mic, MicOff, Paperclip, Send, Lock } from 'lucide-react';

interface MessageInputProps {
  onSend: (content: string) => void;
  isListening: boolean;
  onStartVoice: () => void;
  onStopVoice: () => void;
  transcript: string;
}

export default function MessageInput({
  onSend,
  isListening,
  onStartVoice,
  onStopVoice,
  transcript,
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && attachments.length === 0) return;
    
    onSend(message);
    setMessage('');
    setAttachments([]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      {attachments.length > 0 && (
        <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
          {attachments.map(file => (
            <div key={file.name} className="px-3 py-1 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm whitespace-nowrap">
              {file.name}
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Paperclip className="text-gray-600 dark:text-gray-300" size={20} />
        </button>
        
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pr-10"
          />
          <Lock
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
        </div>
        
        <button
          type="button"
          onClick={isListening ? onStopVoice : onStartVoice}
          className={`p-2 rounded-lg transition-colors ${
            isListening 
              ? 'bg-red-500 text-white' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {isListening ? (
            <MicOff size={20} />
          ) : (
            <Mic className="text-gray-600 dark:text-gray-300" size={20} />
          )}
        </button>
        
        <button
          type="submit"
          disabled={!message.trim() && attachments.length === 0}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={20} />
        </button>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        multiple
      />
    </form>
  );
}