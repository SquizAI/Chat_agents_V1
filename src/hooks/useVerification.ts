import { useState, useCallback } from 'react';
import { verificationService } from '../services/verification/VerificationService';
import { useToastStore } from '../store/slices/toastSlice';

export function useVerification() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const { addToast } = useToastStore();

  const sendVerificationCode = useCallback(async (phoneNumber: string): Promise<boolean> => {
    setIsSendingCode(true);
    try {
      const result = await verificationService.sendVerificationCode(phoneNumber);
      
      addToast({
        type: result.success ? 'success' : 'error',
        message: result.message
      });

      return result.success;
    } catch (error) {
      addToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to send verification code'
      });
      return false;
    } finally {
      setIsSendingCode(false);
    }
  }, [addToast]);

  const verifyCode = useCallback(async (
    phoneNumber: string,
    code: string
  ): Promise<boolean> => {
    setIsVerifying(true);
    try {
      const result = await verificationService.verifyCode(phoneNumber, code);
      
      addToast({
        type: result.success ? 'success' : 'error',
        message: result.message
      });

      return result.success && result.verified || false;
    } catch (error) {
      addToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to verify code'
      });
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, [addToast]);

  return {
    isVerifying,
    isSendingCode,
    sendVerificationCode,
    verifyCode
  };
}