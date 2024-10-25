import React, { useState } from 'react';
import { Phone, MessageSquare, Mic, Send } from 'lucide-react';
import { useCommunicationStore } from '../store/slices/communicationSlice';
import { Contact } from '../types';

interface CommunicationPanelProps {
  contact: Contact;
}

export default function CommunicationPanel({ contact }: CommunicationPanelProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const { makeCall, sendMessage, getContactCommunication } = useCommunicationStore();
  const communication = getContactCommunication(contact.id);

  const handleCall = async () => {
    if (!contact.phone) return;
    
    const success = await makeCall(contact.id, contact.phone);
    if (!success) {
      // Show error notification
      console.error('Failed to initiate call');
    }
  };

  const handleSendMessage = async () => {
    if (!contact.phone || !message.trim()) return;
    
    const success = await sendMessage(contact.id, contact.phone, message.trim());
    if (success) {
      setMessage('');
    } else {
      // Show error notification
      console.error('Failed to send message');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {communication.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.direction === 'outbound' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                msg.direction === 'outbound'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}
            >
              <p>{msg.content}</p>
              <span className="text-xs opacity-70">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex gap-2">
          <button
            onClick={handleCall}
            className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg"
          >
            <Phone size={24} />
          </button>
          
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`p-2 ${
              isRecording ? 'text-red-500' : 'text-gray-500'
            } hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg`}
          >
            <Mic size={24} />
          </button>
          
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}