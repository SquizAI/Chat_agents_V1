import React from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import { useVoiceInput } from '../hooks/useVoiceInput';

interface VoiceInputProps {
  onTranscriptComplete?: (transcript: string) => void;
  className?: string;
}

export default function VoiceInput({ onTranscriptComplete, className = '' }: VoiceInputProps) {
  const {
    isListening,
    transcript,
    hasPermission,
    error,
    startListening,
    stopListening,
    resetTranscript
  } = useVoiceInput();

  const handleToggle = async () => {
    if (isListening) {
      stopListening();
      if (transcript.trim() && onTranscriptComplete) {
        onTranscriptComplete(transcript.trim());
        resetTranscript();
      }
    } else {
      await startListening();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleToggle}
        disabled={!hasPermission}
        className={`p-2 rounded-full transition-colors ${
          isListening
            ? 'bg-red-500 text-white hover:bg-red-600'
            : hasPermission
            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
        title={
          !hasPermission
            ? 'Microphone access required'
            : isListening
            ? 'Stop recording'
            : 'Start recording'
        }
      >
        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
      </button>

      {error && (
        <div className="absolute bottom-full mb-2 right-0 bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {isListening && transcript && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300">{transcript}</p>
        </div>
      )}
    </div>
  );
}