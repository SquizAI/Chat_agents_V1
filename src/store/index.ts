import { create } from 'zustand';
import { ChatState, SystemState } from '../types';

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          ...message,
        },
      ],
    })),
  clearMessages: () => set({ messages: [] }),
}));

export const useSystemStore = create<SystemState>((set) => ({
  agents: {
    ideation: { status: 'idle' },
    flowchart: { status: 'idle' },
    mindmap: { status: 'idle' },
  },
  setAgentStatus: (agentId, status, error) =>
    set((state) => ({
      agents: {
        ...state.agents,
        [agentId]: { status, error },
      },
    })),
}));