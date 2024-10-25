import { useState, useCallback, useEffect, useRef } from 'react';
import { useToastStore } from '../store/slices/toastSlice';

interface VoiceInputState {
  isListening: boolean;
  transcript: string;
  hasPermission: boolean;
  error: string | null;
}

export function useVoiceInput() {
  const [state, setState] = useState<VoiceInputState>({
    isListening: false,
    transcript: '',
    hasPermission: false,
    error: null
  });
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { addToast } = useToastStore();

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setState(prev => ({ ...prev, error: 'Speech recognition not supported in this browser' }));
      addToast({
        type: 'error',
        message: 'Speech recognition is not supported in your browser'
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setState(prev => ({ ...prev, isListening: true, error: null }));
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      let errorMessage = '';
      switch (event.error) {
        case 'not-allowed':
          errorMessage = 'Microphone permission denied';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone detected';
          break;
        case 'network':
          errorMessage = 'Network error occurred';
          break;
        default:
          errorMessage = 'An error occurred with speech recognition';
      }
      
      setState(prev => ({ 
        ...prev, 
        isListening: false, 
        error: errorMessage,
        hasPermission: event.error !== 'not-allowed'
      }));
      
      addToast({
        type: 'error',
        message: errorMessage
      });
    };

    recognition.onend = () => {
      setState(prev => ({ ...prev, isListening: false }));
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      
      setState(prev => ({
        ...prev,
        transcript: prev.transcript + ' ' + transcript
      }));
    };

    recognitionRef.current = recognition;

    // Check for permission on mount
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        setState(prev => ({ ...prev, hasPermission: true }));
      })
      .catch((error) => {
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          setState(prev => ({ 
            ...prev, 
            hasPermission: false,
            error: 'Microphone permission denied'
          }));
          addToast({
            type: 'error',
            message: 'Please allow microphone access to use voice input'
          });
        }
      });

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [addToast]);

  const startListening = useCallback(async () => {
    if (!state.hasPermission) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setState(prev => ({ ...prev, hasPermission: true }));
      } catch (error) {
        addToast({
          type: 'error',
          message: 'Please allow microphone access to use voice input'
        });
        return;
      }
    }

    if (recognitionRef.current && !state.isListening) {
      try {
        recognitionRef.current.start();
        setState(prev => ({ 
          ...prev, 
          isListening: true, 
          error: null,
          transcript: ''
        }));
      } catch (error) {
        if (error instanceof Error) {
          addToast({
            type: 'error',
            message: error.message
          });
        }
      }
    }
  }, [state.hasPermission, state.isListening, addToast]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && state.isListening) {
      recognitionRef.current.stop();
      setState(prev => ({ ...prev, isListening: false }));
    }
  }, [state.isListening]);

  const resetTranscript = useCallback(() => {
    setState(prev => ({ ...prev, transcript: '' }));
  }, []);

  return {
    isListening: state.isListening,
    transcript: state.transcript,
    hasPermission: state.hasPermission,
    error: state.error,
    startListening,
    stopListening,
    resetTranscript
  };
}

// Add proper TypeScript support for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}