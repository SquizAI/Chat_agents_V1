import React from 'react';
import { Phone, Download, FileText } from 'lucide-react';
import { Call } from '../types';
import { format } from 'date-fns';

interface CallHistoryProps {
  calls: Call[];
  onPlayRecording?: (call: Call) => void;
  onViewTranscript?: (call: Call) => void;
}

export default function CallHistory({ calls, onPlayRecording, onViewTranscript }: CallHistoryProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Call History</h3>
      
      <div className="space-y-2">
        {calls.map((call) => (
          <div
            key={call.id}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-500" />
                <span className="font-medium">{call.phoneNumber}</span>
              </div>
              <span className="text-sm text-gray-500">
                {format(new Date(call.timestamp), 'MMM d, yyyy h:mm a')}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Duration: {formatDuration(call.duration)}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                call.status === 'completed' ? 'bg-green-100 text-green-600' :
                call.status === 'failed' ? 'bg-red-100 text-red-600' :
                'bg-yellow-100 text-yellow-600'
              }`}>
                {call.status}
              </span>
            </div>

            {call.recording && (
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => onPlayRecording?.(call)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <Download size={16} />
                </button>
                {call.transcript && (
                  <button
                    onClick={() => onViewTranscript?.(call)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <FileText size={16} />
                  </button>
                )}
              </div>
            )}

            {call.summary && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                <p className="font-medium mb-1">Summary:</p>
                <p>{call.summary}</p>
              </div>
            )}
          </div>
        ))}

        {calls.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No calls recorded yet
          </div>
        )}
      </div>
    </div>
  );
}