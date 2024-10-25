import { AgentType, ProcessingResult } from '../../types';
import { aiService } from '../ai';
import { twilioService } from '../twilio';

export class AgentManager {
  private static instance: AgentManager;
  private agents: Map<string, Agent> = new Map();

  private constructor() {
    this.registerAgent('communication', new CommunicationAgent());
    this.registerAgent('workflow', new WorkflowAgent());
    this.registerAgent('analysis', new AnalysisAgent());
  }

  static getInstance(): AgentManager {
    if (!AgentManager.instance) {
      AgentManager.instance = new AgentManager();
    }
    return AgentManager.instance;
  }

  registerAgent(id: string, agent: Agent) {
    this.agents.set(id, agent);
  }

  async process(agentId: string, input: any): Promise<ProcessingResult> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }
    return agent.process(input);
  }

  async broadcast(input: any): Promise<ProcessingResult[]> {
    const results: ProcessingResult[] = [];
    for (const agent of this.agents.values()) {
      if (agent.canHandle(input)) {
        results.push(await agent.process(input));
      }
    }
    return results;
  }
}

abstract class Agent {
  abstract canHandle(input: any): boolean;
  abstract process(input: any): Promise<ProcessingResult>;
}

class CommunicationAgent extends Agent {
  canHandle(input: any): boolean {
    return input.type === 'message' || input.type === 'call';
  }

  async process(input: any): Promise<ProcessingResult> {
    try {
      if (input.type === 'message') {
        const analysis = await aiService.analyzeMessage(input.content);
        if (analysis.priorityLevel >= 4) {
          await twilioService.sendMessage(
            input.recipient,
            `Urgent: ${input.content}`
          );
        }
        return {
          success: true,
          data: analysis,
          description: 'Message processed and analyzed'
        };
      }

      if (input.type === 'call') {
        const transcript = await aiService.transcribeAudio(input.recording);
        const summary = await aiService.generateCallSummary(transcript);
        return {
          success: true,
          data: { transcript, summary },
          description: 'Call processed and summarized'
        };
      }

      return {
        success: false,
        error: 'Unsupported communication type'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

class WorkflowAgent extends Agent {
  canHandle(input: any): boolean {
    return input.type === 'workflow';
  }

  async process(input: any): Promise<ProcessingResult> {
    try {
      const suggestions = await aiService.generateCampaignSuggestions(input.content);
      const reminders = await aiService.suggestReminders(input.content);

      return {
        success: true,
        data: { suggestions, reminders },
        description: 'Workflow suggestions generated'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

class AnalysisAgent extends Agent {
  canHandle(input: any): boolean {
    return input.type === 'analysis';
  }

  async process(input: any): Promise<ProcessingResult> {
    try {
      const analysis = await aiService.analyzeMessage(input.content);
      return {
        success: true,
        data: analysis,
        description: 'Content analyzed'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const agentManager = AgentManager.getInstance();