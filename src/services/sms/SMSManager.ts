import { twilioService } from '../twilio';
import { agentManager } from '../agents/AgentManager';
import { Message } from '../../types';
import { useToastStore } from '../../store/slices/toastSlice';

export class SMSManager {
  private static instance: SMSManager;
  private messageQueue: Message[] = [];
  private processing = false;

  private constructor() {
    this.processQueue();
  }

  static getInstance(): SMSManager {
    if (!SMSManager.instance) {
      SMSManager.instance = new SMSManager();
    }
    return SMSManager.instance;
  }

  async sendMessage(phoneNumber: string, content: string): Promise<boolean> {
    try {
      const messageSid = await twilioService.sendMessage(phoneNumber, content);
      if (messageSid) {
        const message: Message = {
          id: messageSid,
          phoneNumber,
          content,
          timestamp: new Date(),
          status: 'sent',
          direction: 'outbound'
        };

        this.messageQueue.push(message);
        this.processQueue();
        return true;
      }
      return false;
    } catch (error) {
      useToastStore.getState().addToast({
        type: 'error',
        message: 'Failed to send message'
      });
      return false;
    }
  }

  async handleIncomingMessage(data: any): Promise<void> {
    try {
      await twilioService.handleIncomingMessage(data);
      
      const result = await agentManager.process('communication', {
        type: 'message',
        content: data.Body,
        sender: data.From
      });

      if (result.success && result.data?.priorityLevel >= 4) {
        useToastStore.getState().addToast({
          type: 'warning',
          message: 'High priority message received'
        });
      }
    } catch (error) {
      useToastStore.getState().addToast({
        type: 'error',
        message: 'Error processing incoming message'
      });
    }
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.messageQueue.length === 0) return;

    this.processing = true;
    try {
      while (this.messageQueue.length > 0) {
        const message = this.messageQueue.shift();
        if (!message) continue;

        await agentManager.process('communication', {
          type: 'message',
          content: message.content,
          recipient: message.phoneNumber
        });
      }
    } finally {
      this.processing = false;
    }
  }
}

export const smsManager = SMSManager.getInstance();