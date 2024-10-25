import { ReactNode } from 'react';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  tags: string[];
  category: 'personal' | 'business' | 'other';
  notes?: string;
  lastContacted?: Date;
  reminders: Reminder[];
}

export interface Call {
  id: string;
  contactId?: string;
  phoneNumber: string;
  timestamp: Date;
  duration: number;
  status: 'initiated' | 'in-progress' | 'completed' | 'failed';
  recording: string | null;
  transcript: string | null;
  summary: string | null;
}

export interface Message {
  id: string;
  contactId?: string;
  phoneNumber: string;
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'failed';
  direction: 'inbound' | 'outbound';
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  contactId?: string;
  messageId?: string;
}

export interface Campaign {
  id: string;
  name: string;
  message: string;
  recipients: string[];
  status: 'draft' | 'scheduled' | 'running' | 'completed';
  scheduledDate?: Date;
  stats: {
    sent: number;
    delivered: number;
    read: number;
    responded: number;
  };
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  contactId: string;
  status: 'active' | 'paused' | 'completed';
  steps: WorkflowStep[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowStep {
  id: string;
  type: 'message' | 'call' | 'email' | 'task' | 'reminder';
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  dueDate?: Date;
  completedAt?: Date;
  metadata?: Record<string, any>;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description?: string;
  steps: Omit<WorkflowStep, 'status' | 'completedAt'>[];
  category?: string;
  tags?: string[];
}

export interface Tab {
  id: string;
  icon: ReactNode;
  label: string;
  component: ReactNode;
}

export interface AppState {
  contacts: Contact[];
  campaigns: Campaign[];
  reminders: Reminder[];
  messages: Message[];
  activeTab: string;
  searchQuery: string;
  selectedContact?: Contact;
}

export interface AIAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  suggestedActions: string[];
  priorityLevel: number;
  categories: string[];
}

export interface AgentType {
  type: 'code_interpreter' | 'retrieval' | 'function';
  name?: string;
  description?: string;
  parameters?: Record<string, any>;
}

export interface ProcessingResult {
  success: boolean;
  data?: any;
  error?: string;
  description?: string;
  diagram?: string;
  topic?: string;
}