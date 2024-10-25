import { env } from '../config/env';
import { AIAnalysis, Message, Call } from '../types';
import OpenAI from 'openai';

export class AIService {
  private static instance: AIService;
  private openai: OpenAI;

  private constructor() {
    if (!env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is required');
    }

    this.openai = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async analyzeMessage(content: string): Promise<AIAnalysis> {
    const completion = await this.openai.chat.completions.create({
      model: "o1-mini",
      messages: [
        {
          role: "system",
          content: "Analyze the following message and provide sentiment, suggested actions, priority level (1-5), and categories. Return only JSON."
        },
        { role: "user", content }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0].message.content || '{}');
  }

  async generateCampaignSuggestions(content: string): Promise<any> {
    const completion = await this.openai.chat.completions.create({
      model: "o1-mini",
      messages: [
        {
          role: "system",
          content: "Generate campaign suggestions based on the following content. Return JSON with suggestions array."
        },
        { role: "user", content }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0].message.content || '{}');
  }

  async suggestReminders(content: string): Promise<string[]> {
    const completion = await this.openai.chat.completions.create({
      model: "o1-mini",
      messages: [
        {
          role: "system",
          content: "Based on the content, suggest relevant reminders. Return JSON with reminders array."
        },
        { role: "user", content }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    return result.reminders || [];
  }

  async transcribeAudio(audioBlob: Blob): Promise<string> {
    const formData = new FormData();
    formData.append('file', audioBlob);
    formData.append('model', 'whisper-1');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to transcribe audio');
    }

    const data = await response.json();
    return data.text;
  }

  async generateCallSummary(transcript: string): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      model: "o1-mini",
      messages: [
        {
          role: "system",
          content: "Create a concise summary of this call transcript, highlighting key points and action items."
        },
        { role: "user", content: transcript }
      ]
    });

    return completion.choices[0].message.content || '';
  }
}

export const aiService = AIService.getInstance();