import { create } from 'zustand';
import { Message } from '../../types';
import { twilioService } from '../../services/twilio';
import { useToastStore } from './toastSlice';

interface CommunicationState {
  messages: Message[];
  sendMessage: (phoneNumber: string, content: string) => Promise<boolean>;
  addMessage: (message: Message) => void;
  updateMessageStatus: (messageId: string, status: Message['status']) => void;
  markMessageAsRead: (messageId: string) => void;
}

export const useCommunicationStore = create<CommunicationState>((set) => ({
  messages: [],

  sendMessage: async (phoneNumber: string, content: string) => {
    try {
      const messageSid = await twilioService.sendMessage(phoneNumber, content);
      if (messageSid) {
        const newMessage: Message = {
          id: messageSid,
          phoneNumber,
          content,
          timestamp: new Date(),
          status: 'sent',
          direction: 'outbound'
        };
        set(state => ({
          messages: [...state.messages, newMessage]
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Message failed:', error);
      useToastStore.getState().addToast({
        type: 'error',
        message: 'Failed to send message'
      });
      return false;
    }
  },

  addMessage: (message: Message) => {
    set(state => ({
      messages: [...state.messages, message]
    }));
  },

  updateMessageStatus: (messageId: string, status: Message['status']) => {
    set(state => ({
      messages: state.messages.map(msg =>
        msg.id === messageId ? { ...msg, status } : msg
      )
    }));
  },

  markMessageAsRead: (messageId: string) => {
    set(state => ({
      messages: state.messages.map(msg =>
        msg.id === messageId ? { ...msg, status: 'read' } : msg
      )
    }));
  }
}));