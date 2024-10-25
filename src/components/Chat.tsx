import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { useChatStore } from '../store';
import Message from './Message';
import { wsService } from '../services/websocket';
import { useVoiceInput } from '../hooks/useVoiceInput';

export default function Chat() {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { messages, addMessage } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isListening, transcript, startListening, stopListening } = useVoiceInput();

  useEffect(() => {
    wsService.on('text-delta', (delta) => {
      setIsTyping(true);
      addMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: delta,
        timestamp: new Date(),
      });
    });

    wsService.on('speech-started', () => {
      setIsTyping(true);
    });

    wsService.on('speech-stopped', () => {
      setIsTyping(false);
    });

    return () => {
      wsService.off('text-delta', () => {});
      wsService.off('speech-started', () => {});
      wsService.off('speech-stopped', () => {});
    };
  }, [addMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setInput('');

    wsService.send({
      event_id: crypto.randomUUID(),
      type: 'session.update',
      session: {
        modalities: ['text'],
        instructions: 'You are a helpful AI assistant.',
      },
    });

    wsService.send({
      event_id: crypto.randomUUID(),
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [{
          type: 'text',
          text: input,
        }],
      },
    });
  };

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="flex items-center justify-between p-4 border-b bg-white dark:bg-gray-800">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">AI Virtual Assistant</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        {isTyping && (
          <div className="flex space-x-2 items-center text-gray-500">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t bg-white dark:bg-gray-800">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={`p-2 rounded-lg transition-colors ${
              isListening 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}