import React, { createContext, useContext, useState } from 'react';
import { AIService } from '../services/ai';
import { AIAnalysis } from '../types';

interface AIContextType {
  generateAIResponse: (input: string) => Promise<string>;
  analyzeMessage: (content: string) => Promise<AIAnalysis>;
  translateMessage: (text: string, targetLang: string) => Promise<string>;
  generateCampaignSuggestions: (content: string) => Promise<any>;
  suggestReminders: (content: string) => Promise<string[]>;
  isProcessing: boolean;
  error: string | null;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: React.ReactNode }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: any) => {
    console.error('AI Error:', error);
    setError(error.message || 'An error occurred');
    throw error;
  };

  const generateAIResponse = async (input: string) => {
    setIsProcessing(true);
    setError(null);
    try {
      return await AIService.generateResponse(input);
    } catch (error) {
      handleError(error);
      return 'I apologize, but I encountered an error processing your request.';
    } finally {
      setIsProcessing(false);
    }
  };

  const analyzeMessage = async (content: string) => {
    setIsProcessing(true);
    setError(null);
    try {
      return await AIService.analyzeMessage(content);
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const translateMessage = async (text: string, targetLang: string) => {
    setIsProcessing(true);
    setError(null);
    try {
      return await AIService.translateMessage(text, targetLang);
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const generateCampaignSuggestions = async (content: string) => {
    setIsProcessing(true);
    setError(null);
    try {
      return await AIService.generateCampaignSuggestions(content);
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const suggestReminders = async (content: string) => {
    setIsProcessing(true);
    setError(null);
    try {
      return await AIService.suggestReminders(content);
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AIContext.Provider value={{
      generateAIResponse,
      analyzeMessage,
      translateMessage,
      generateCampaignSuggestions,
      suggestReminders,
      isProcessing,
      error
    }}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}