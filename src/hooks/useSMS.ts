import { useState, useCallback } from 'react';
import { smsManager } from '../services/sms/SMSManager';
import { useToastStore } from '../store/slices/toastSlice';

export function useSMS() {
  const [isSending, setIsSending] = useState(false);
  const { addToast } = useToastStore();

  const sendMessage = useCallback(async (
    phoneNumber: string,
    content: string
  ): Promise<boolean> => {
    setIsSending(true);
    try {
      const success = await smsManager.sendMessage(phoneNumber, content);
      if (success) {
        addToast({
          type: 'success',
          message: 'Message sent successfully'
        });
      }
      return success;
    } catch (error) {
      addToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to send message'
      });
      return false;
    } finally {
      setIsSending(false);
    }
  }, [addToast]);

  return {
    isSending,
    sendMessage
  };
}