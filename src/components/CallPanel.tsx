import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Save } from 'lucide-react';
import { useToastStore } from './Toast';
import { useCommunicationStore } from '../store/slices/communicationSlice';
import { Call } from '../types';
import { AIService } from '../services/ai';

interface CallPanelProps {
  phoneNumber: string;
  onSummaryGenerated?: (summary: string) => void;
}

export default function CallPanel({ phoneNumber, onSummaryGenerated }: CallPanelProps) {
  const [isInCall, setIsInCall] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const { addToast } = useToastStore();
  const { makeCall, updateCallStatus, addCallRecording } = useCommunicationStore();
  const [currentCall, setCurrentCall] = useState<Call | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isInCall) {
      timer = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isInCall]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = async () => {
    try {
      const callId = await makeCall(phoneNumber);
      if (callId) {
        setIsInCall(true);
        setCurrentCall({
          id: callId,
          phoneNumber,
          timestamp: new Date(),
          duration: 0,
          status: 'in-progress',
          recording: null,
          transcript: null,
          summary: null
        });
        addToast({
          type: 'success',
          message: 'Call connected successfully'
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Failed to connect call'
      });
    }
  };

  const handleEndCall = async () => {
    if (!currentCall) return;

    try {
      await updateCallStatus(currentCall.id, 'completed');
      setIsInCall(false);
      setIsRecording(false);
      
      if (audioChunks.length > 0) {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        await addCallRecording(currentCall.id, audioBlob);
        
        // Generate transcript and summary
        const transcript = await AIService.transcribeAudio(audioBlob);
        const summary = await AIService.generateCallSummary(transcript);
        
        if (onSummaryGenerated) {
          onSummaryGenerated(summary);
        }

        addToast({
          type: 'success',
          message: 'Call recording saved and processed'
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Failed to process call recording'
      });
    }
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
          setAudioChunks(chunks);
        };

        mediaRecorder.start();
        setIsRecording(true);
        addToast({
          type: 'info',
          message: 'Recording started'
        });
      } catch (error) {
        addToast({
          type: 'error',
          message: 'Failed to start recording'
        });
      }
    } else {
      setIsRecording(false);
      addToast({
        type: 'info',
        message: 'Recording stopped'
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${
            isInCall ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
          }`} />
          <span className="font-medium">{phoneNumber}</span>
        </div>
        <span className="text-sm text-gray-500">{formatDuration(duration)}</span>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={isInCall ? handleEndCall : handleStartCall}
          className={`p-4 rounded-full ${
            isInCall 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-green-500 hover:bg-green-600'
          } text-white transition-colors`}
        >
          {isInCall ? <PhoneOff size={24} /> : <Phone size={24} />}
        </button>

        {isInCall && (
          <button
            onClick={toggleRecording}
            className={`p-4 rounded-full ${
              isRecording
                ? 'bg-red-100 text-red-500'
                : 'bg-gray-100 text-gray-500'
            } hover:bg-opacity-80 transition-colors`}
          >
            {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
        )}
      </div>

      {audioChunks.length > 0 && !isInCall && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Recording saved</span>
            <button
              onClick={() => {
                const url = URL.createObjectURL(new Blob(audioChunks, { type: 'audio/webm' }));
                const a = document.createElement('a');
                a.href = url;
                a.download = `call-${new Date().toISOString()}.webm`;
                a.click();
              }}
              className="text-blue-500 hover:text-blue-600"
            >
              <Save size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}