import { create } from 'zustand';
import { Workflow, WorkflowTemplate, WorkflowStep } from '../../types';

interface WorkflowsState {
  workflows: Workflow[];
  templates: WorkflowTemplate[];
  addWorkflow: (workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void;
  deleteWorkflow: (id: string) => void;
  updateWorkflowStep: (workflowId: string, stepId: string, updates: Partial<WorkflowStep>) => void;
  addTemplate: (template: Omit<WorkflowTemplate, 'id'>) => void;
  updateTemplate: (id: string, updates: Partial<WorkflowTemplate>) => void;
  deleteTemplate: (id: string) => void;
  createWorkflowFromTemplate: (templateId: string, contactId: string) => void;
}

export const useWorkflowsStore = create<WorkflowsState>((set, get) => ({
  workflows: [],
  templates: [],

  addWorkflow: (workflow) =>
    set((state) => ({
      workflows: [
        ...state.workflows,
        {
          ...workflow,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    })),

  updateWorkflow: (id, updates) =>
    set((state) => ({
      workflows: state.workflows.map((workflow) =>
        workflow.id === id
          ? { ...workflow, ...updates, updatedAt: new Date() }
          : workflow
      ),
    })),

  deleteWorkflow: (id) =>
    set((state) => ({
      workflows: state.workflows.filter((workflow) => workflow.id !== id),
    })),

  updateWorkflowStep: (workflowId, stepId, updates) =>
    set((state) => ({
      workflows: state.workflows.map((workflow) =>
        workflow.id === workflowId
          ? {
              ...workflow,
              steps: workflow.steps.map((step) =>
                step.id === stepId ? { ...step, ...updates } : step
              ),
              updatedAt: new Date(),
            }
          : workflow
      ),
    })),

  addTemplate: (template) =>
    set((state) => ({
      templates: [
        ...state.templates,
        {
          ...template,
          id: crypto.randomUUID(),
        },
      ],
    })),

  updateTemplate: (id, updates) =>
    set((state) => ({
      templates: state.templates.map((template) =>
        template.id === id ? { ...template, ...updates } : template
      ),
    })),

  deleteTemplate: (id) =>
    set((state) => ({
      templates: state.templates.filter((template) => template.id !== id),
    })),

  createWorkflowFromTemplate: (templateId, contactId) => {
    const template = get().templates.find((t) => t.id === templateId);
    if (!template) return;

    const steps: WorkflowStep[] = template.steps.map((step) => ({
      ...step,
      id: crypto.randomUUID(),
      status: 'pending',
    }));

    get().addWorkflow({
      name: template.name,
      description: template.description,
      contactId,
      steps,
      status: 'active',
    });
  },
}));