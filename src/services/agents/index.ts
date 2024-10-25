import { AgentType, ProcessingResult } from '../../types';
import { api } from '../api';
import { useSystemStore } from '../../store';

export class AgentProcessor {
  private static async processWithRetry(
    fn: () => Promise<ProcessingResult>,
    maxRetries = 3
  ): Promise<ProcessingResult> {
    let lastError: Error | null = null;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
        }
      }
    }
    
    throw lastError;
  }

  static async process(message: string, agentType: AgentType): Promise<ProcessingResult> {
    const { setAgentStatus } = useSystemStore.getState();
    
    try {
      setAgentStatus(agentType, 'thinking');
      
      const result = await this.processWithRetry(async () => {
        const response = await api.processMessage(message, agentType);
        
        switch (agentType) {
          case 'flowchart':
            return {
              ...response,
              diagram: await api.generateFlowchart(response.description),
            };
          case 'mindmap':
            return {
              ...response,
              diagram: await api.generateMindMap(response.topic),
            };
          default:
            return response;
        }
      });
      
      setAgentStatus(agentType, 'idle');
      return result;
    } catch (error) {
      setAgentStatus(agentType, 'error', (error as Error).message);
      throw error;
    }
  }
}