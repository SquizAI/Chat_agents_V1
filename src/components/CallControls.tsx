import React, { useState } from 'react';
import { Phone, PhoneOff, MessageSquare } from 'lucide-react';
import { twilioService } from '../services/twilio';
import { useCommunicationStore } from '../store/slices/communicationSlice';

interface CallControlsProps {
  phoneNumber: string;
  onCallStart: () => void;
  onCallEnd: () => void;
  onSummaryReceived: (summary: string) => void;
}

export default function CallControls({ 
  phoneNumber, 
  onCallStart, 
  onCallEnd, 
  onSummaryReceived 
}: CallControlsProps) {
  const [isInCall, setIsInCall] = useState(false);
  const [message, setMessage] = useState('');
  const { makeCall, sendMessage } = useCommunicationStore();

  const handleCall = async () => {
    if (!phoneNumber) return;

    if (!isInCall) {
      const success = await makeCall(phoneNumber);
      if (success) {
        setIsInCall(true);
        onCallStart();
      }
    } else {
      setIsInCall(false);
      onCallEnd();
    }
  };

  const handleSendSMS = async () => {
    if (!phoneNumber || !message.trim()) return;

    const success = await sendMessage(phoneNumber, message.trim());
    if (success) {
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="flex gap-2">
        <button
          onClick={handleCall}
          className={`p-2 rounded-lg ${
            isInCall 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-green-500 hover:bg-green-600'
          } text-white`}
        >
          {isInCall ? <PhoneOff size={20} /> : <Phone size={20} />}
        </button>
        <span className="flex-1 flex items-center text-gray-600 dark:text-gray-300">
          {phoneNumber}
        </span>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type SMS message"
          className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
        />
        <button
          onClick={handleSendSMS}
          disabled={!message.trim()}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          <MessageSquare size={20} />
        </button>
      </div>
    </div>
  );
}