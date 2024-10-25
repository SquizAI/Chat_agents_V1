import { Swarm, Agent } from '@openai/swarm';
import { env } from '../../config/env';
import { AIAnalysis, ProcessingResult } from '../../types';

export class SwarmService {
  private static instance: SwarmService;
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

  static getInstance(): SwarmService {
    if (!SwarmService.instance) {
      SwarmService.instance = new SwarmService();
    }
    return SwarmService.instance;
  }

  private initializeAgents() {
    // Analysis Agent
    const analysisAgent = new Agent({
      name: "Analysis Agent",
      instructions: "You analyze content and provide detailed insights.",
      model: "o1-mini",
      functions: [this.analyzeContent]
    });

    // Communication Agent
    const communicationAgent = new Agent({
      name: "Communication Agent",
      instructions: "You handle message processing and responses.",
      model: "o1-mini",
      functions: [this.processMessage]
    });

    // Workflow Agent
    const workflowAgent = new Agent({
      name: "Workflow Agent",
      instructions: "You manage task workflows and automation.",
      model: "o1-mini",
      functions: [this.handleWorkflow]
    });

    this.agents.set('analysis', analysisAgent);
    this.agents.set('communication', communicationAgent);
    this.agents.set('workflow', workflowAgent);
  }

  private async analyzeContent(content: string): Promise<AIAnalysis> {
    return {
      sentiment: 'neutral',
      suggestedActions: [],
      priorityLevel: 1,
      categories: []
    };
  }

  private async processMessage(message: string): Promise<ProcessingResult> {
    return {
      success: true,
      data: { processed: true },
      description: 'Message processed'
    };
  }

  private async handleWorkflow(workflow: any): Promise<ProcessingResult> {
    return {
      success: true,
      data: { handled: true },
      description: 'Workflow handled'
    };
  }

  async process(agentType: string, input: any): Promise<ProcessingResult> {
    const agent = this.agents.get(agentType);
    if (!agent) {
      throw new Error(`Agent ${agentType} not found`);
    }

    const response = await this.swarm.run(agent, [
      { role: "user", content: JSON.stringify(input) }
    ]);

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

export const swarmService = SwarmService.getInstance();