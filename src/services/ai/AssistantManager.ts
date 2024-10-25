import OpenAI from 'openai';
import { env } from '../../config/env';
import { AIAnalysis } from '../../types';

export class AssistantManager {
  private static instance: AssistantManager;
  private openai: OpenAI;
  private assistants: Map<string, string> = new Map();

  private constructor() {
    if (!env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is required');
    }

    this.openai = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });

    this.initializeAssistants();
  }

  static getInstance(): AssistantManager {
    if (!AssistantManager.instance) {
      AssistantManager.instance = new AssistantManager();
    }
    return AssistantManager.instance;
  }

  private async initializeAssistants() {
    // Create Communication Assistant
    const communicationAssistant = await this.openai.beta.assistants.create({
      name: "Communication Assistant",
      instructions: "You are a communication expert. Analyze messages for sentiment, priority, and suggest appropriate responses.",
      model: "gpt-3.5-turbo",
      tools: [{ type: "code_interpreter" }]
    });
    this.assistants.set('communication', communicationAssistant.id);

    // Create Workflow Assistant
    const workflowAssistant = await this.openai.beta.assistants.create({
      name: "Workflow Assistant",
      instructions: "You help create and manage workflows, suggesting reminders and campaign strategies.",
      model: "gpt-3.5-turbo",
      tools: [{ type: "code_interpreter" }]
    });
    this.assistants.set('workflow', workflowAssistant.id);

    // Create Analysis Assistant
    const analysisAssistant = await this.openai.beta.assistants.create({
      name: "Analysis Assistant",
      instructions: "You analyze content and provide detailed insights and recommendations.",
      model: "gpt-3.5-turbo",
      tools: [{ type: "code_interpreter" }]
    });
    this.assistants.set('analysis', analysisAssistant.id);
  }

  async processMessage(content: string, type: 'communication' | 'workflow' | 'analysis'): Promise<any> {
    const assistantId = this.assistants.get(type);
    if (!assistantId) {
      throw new Error(`Assistant type ${type} not found`);
    }

    // Create a thread
    const thread = await this.openai.beta.threads.create();

    // Add a message to the thread
    await this.openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content
    });

    // Run the assistant
    const run = await this.openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId
    });

    // Wait for the run to complete
    let runStatus = await this.openai.beta.threads.runs.retrieve(thread.id, run.id);
    while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await this.openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    // Get the messages
    const messages = await this.openai.beta.threads.messages.list(thread.id);
    const lastMessage = messages.data[0];

    // Clean up
    await this.openai.beta.threads.del(thread.id);

    return lastMessage.content[0].text.value;
  }

  async analyzeMessage(content: string): Promise<AIAnalysis> {
    const result = await this.processMessage(content, 'analysis');
    return JSON.parse(result);
  }

  async generateWorkflowSuggestions(content: string): Promise<any> {
    return this.processMessage(content, 'workflow');
  }

  async generateCampaignSuggestions(content: string): Promise<any> {
    const result = await this.processMessage(content, 'workflow');
    return JSON.parse(result);
  }

  async suggestReminders(content: string): Promise<string[]> {
    const result = await this.processMessage(content, 'workflow');
    return result.split('\n').filter(Boolean);
  }
}

export const assistantManager = AssistantManager.getInstance();