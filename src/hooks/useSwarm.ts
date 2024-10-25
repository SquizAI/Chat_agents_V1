import { useState, useCallback } from 'react';
import { swarmService } from '../services/agents/SwarmService';
import { ProcessingResult } from '../types';
import { useToastStore } from '../store/slices/toastSlice';

export function useSwarm() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { addToast } = useToastStore();

  const processWithAgent = useCallback(async (
    agentType: string,
    input: any
  ): Promise<ProcessingResult | null> => {
    setIsProcessing(true);
    try {
      const result = await swarmService.process(agentType, input);
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
      return await swarmService.broadcast(input);
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