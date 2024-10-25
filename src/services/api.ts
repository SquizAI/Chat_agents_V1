import { AgentType } from '../types';

const API_URL = 'https://api.example.com/v1'; // Replace with your actual API endpoint

export class APIError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'APIError';
  }
}

async function fetchWithTimeout(
  resource: RequestInfo,
  options: RequestInit & { timeout?: number } = {}
) {
  const { timeout = 8000, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(resource, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(id);
    
    if (!response.ok) {
      throw new APIError('API request failed', response.status);
    }
    
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export const api = {
  async processMessage(message: string, agentType: AgentType) {
    try {
      const response = await fetchWithTimeout(`${API_URL}/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, agentType }),
      });
      
      return await response.json();
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError('Failed to process message', 500);
    }
  },
  
  async generateFlowchart(description: string) {
    const response = await fetchWithTimeout(`${API_URL}/flowchart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description }),
    });
    
    return await response.json();
  },
  
  async generateMindMap(topic: string) {
    const response = await fetchWithTimeout(`${API_URL}/mindmap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic }),
    });
    
    return await response.json();
  },
};