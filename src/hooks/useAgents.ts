import { useState, useCallback } from 'react';
import { agentManager } from '../services/agents/AgentManager';
import { ProcessingResult } from '../types';
import { useToastStore } from '../store/slices/toastSlice';

export function useAgents() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { addToast } = useToastStore();

  const processWithAgent = useCallback(async (
    agentId: string,
    input: any
  ): Promise<ProcessingResult | null> => {
    setIsProcessing(true);
    try {
      const result = await agentManager.process(agentId, input);
      if (!result.success) {
        addToast({
          type: 'error',
          message: result.error || 'Processing failed'
        });
        return null;
      }
      return result;
    } catch (error) {
      addToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [addToast]);

  const broadcastToAgents = useCallback(async (
    input: any
  ): Promise<ProcessingResult[]> => {
    setIsProcessing(true);
    try {
      return await agentManager.broadcast(input);
    } catch (error) {
      addToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      return [];
    } finally {
      setIsProcessing(false);
    }
  }, [addToast]);

  return {
    isProcessing,
    processWithAgent,
    broadcastToAgents
  };
}