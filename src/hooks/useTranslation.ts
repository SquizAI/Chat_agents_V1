import { useState, useCallback } from 'react';
import { AIService } from '../services/ai';

export function useTranslation() {
  const [language, setLanguage] = useState('en');

  const translate = useCallback(async (text: string, targetLang: string) => {
    try {
      return await AIService.translateMessage(text, targetLang);
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }, []);

  return {
    t: translate,
    language,
    setLanguage
  };
}