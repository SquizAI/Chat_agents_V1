import { useState, useCallback } from 'react';
import { addressResearchAgent } from '../services/agents/AddressResearchAgent';
import { useToastStore } from '../store/slices/toastSlice';
import { ProcessingResult } from '../types';

export function useAddressResearch() {
  const [isResearching, setIsResearching] = useState(false);
  const [addressData, setAddressData] = useState<ProcessingResult | null>(null);
  const { addToast } = useToastStore();

  const researchAddress = useCallback(async (address: string): Promise<void> => {
    setIsResearching(true);
    try {
      const result = await addressResearchAgent.researchAddress(address);
      setAddressData(result);
      
      if (result.success) {
        addToast({
          type: 'success',
          message: 'Address research completed'
        });
      } else {
        addToast({
          type: 'error',
          message: result.error || 'Failed to research address'
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to research address'
      });
    } finally {
      setIsResearching(false);
    }
  }, [addToast]);

  return {
    isResearching,
    addressData,
    researchAddress
  };
}