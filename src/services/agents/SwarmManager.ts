import { Agent, Swarm } from 'openai-swarm';
import { env } from '../../config/env';
import { AIAnalysis, ProcessingResult } from '../../types';
import { twilioService } from '../twilio';

export class SwarmManager {
  private static instance: SwarmManager;
  private swarm: Swarm;
  private agents: Map<string, Agent>;

  private constructor() {
    if (!env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is required');
    }

    this.swarm = new Swarm();
    this.agents = new Map();
    this.initializeAgents();
  }

  static getInstance(): SwarmManager {
    if (!SwarmManager.instance) {
      SwarmManager.instance = new SwarmManager();
    }
    return SwarmManager.instance;
  }

  private initializeAgents() {
    // Communication Agent
    const communicationAgent = new Agent({
      name: "Communication Agent",
      instructions: "You analyze messages and handle communication tasks.",
      functions: [
        this.analyzeMessage,
        this.sendUrgentMessage,
        this.transferToWorkflow
      ]
    });
    this.agents.set('communication', communicationAgent);

    // Workflow Agent
    const workflowAgent = new Agent({
      name: "Workflow Agent",
      instructions: "You manage workflows and suggest actions.",
      functions: [
        this.generateWorkflow,
        this.suggestReminders,
        this.transferToCommunication
      ]
    });
    this.agents.set('workflow', workflowAgent);

    // Analysis Agent
    const analysisAgent = new Agent({
      name: "Analysis Agent",
      instructions: "You provide detailed analysis of content.",
      functions: [
        this.analyzeContent,
        this.generateInsights,
        this.transferToWorkflow
      ]
    });
    this.agents.set('analysis', analysisAgent);
  }

  private async analyzeMessage(content: string): Promise<AIAnalysis> {
    const response = await this.swarm.run(
      this.agents.get('analysis')!,
      [{ role: "user", content }]
    );
    return JSON.parse(response.messages[response.messages.length - 1].content);
  }

  private async sendUrgentMessage(phoneNumber: string, content: string): Promise<void> {
    await twilioService.sendMessage(phoneNumber, `URGENT: ${content}`);
  }

  private transferToWorkflow(): Agent {
    return this.agents.get('workflow')!;
  }

  private transferToCommunication(): Agent {
    return this.agents.get('communication')!;
  }

  private async generateWorkflow(content: string): Promise<ProcessingResult> {
    const response = await this.swarm.run(
      this.agents.get('workflow')!,
      [{ role: "user", content }]
    );
    return {
      success: true,
      data: JSON.parse(response.messages[response.messages.length - 1].content),
      description: 'Workflow generated'
    };
  }

  private async suggestReminders(content: string): Promise<string[]> {
    const response = await this.swarm.run(
      this.agents.get('workflow')!,
      [{ role: "user", content }]
    );
    return response.messages[response.messages.length - 1].content.split('\n').filter(Boolean);
  }

  private async analyzeContent(content: string): Promise<ProcessingResult> {
    const response = await this.swarm.run(
      this.agents.get('analysis')!,
      [{ role: "user", content }]
    );
    return {
      success: true,
      data: JSON.parse(response.messages[response.messages.length - 1].content),
      description: 'Content analyzed'
    };
  }

  private async generateInsights(content: string): Promise<ProcessingResult> {
    const response = await this.swarm.run(
      this.agents.get('analysis')!,
      [{ role: "user", content }]
    );
    return {
      success: true,
      data: JSON.parse(response.messages[response.messages.length - 1].content),
      description: 'Insights generated'
    };
  }

  async process(agentType: string, input: any): Promise<ProcessingResult> {
    const agent = this.agents.get(agentType);
    if (!agent) {
      throw new Error(`Agent ${agentType} not found`);
    }

    const response = await this.swarm.run(
      agent,
      [{ role: "user", content: JSON.stringify(input) }]
    );

    return {
      success: true,
      data: JSON.parse(response.messages[response.messages.length - 1].content),
      description: `Processed by ${agentType} agent`
    };
  }

  async broadcast(input: any): Promise<ProcessingResult[]> {
    const results: ProcessingResult[] = [];
    for (const [type, agent] of this.agents.entries()) {
      try {
        const result = await this.process(type, input);
        results.push(result);
      } catch (error) {
        console.error(`Error in ${type} agent:`, error);
      }
    }
    return results;
  }
}

export const swarmManager = SwarmManager.getInstance();