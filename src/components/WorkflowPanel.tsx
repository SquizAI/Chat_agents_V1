import React, { useState } from 'react';
import { Plus, Play, Pause, Check, X, AlertCircle, ChevronRight, MessageSquare, Phone, Mail, Bell, CheckSquare } from 'lucide-react';
import { useWorkflowsStore } from '../store/slices/workflowsSlice';
import { Workflow, WorkflowStep, WorkflowTemplate } from '../types';

interface WorkflowPanelProps {
  contactId: string;
}

export default function WorkflowPanel({ contactId }: WorkflowPanelProps) {
  const [showTemplates, setShowTemplates] = useState(false);
  const { workflows, templates, createWorkflowFromTemplate, updateWorkflowStep } = useWorkflowsStore();

  const contactWorkflows = workflows.filter((w) => w.contactId === contactId);

  const getStepIcon = (type: WorkflowStep['type']) => {
    switch (type) {
      case 'message': return <MessageSquare size={16} />;
      case 'call': return <Phone size={16} />;
      case 'email': return <Mail size={16} />;
      case 'task': return <CheckSquare size={16} />;
      case 'reminder': return <Bell size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const getStatusIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed': return <Check className="text-green-500" size={16} />;
      case 'failed': return <X className="text-red-500" size={16} />;
      case 'in_progress': return <Play className="text-blue-500" size={16} />;
      default: return <AlertCircle className="text-gray-400" size={16} />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Workflows</h3>
        <button
          onClick={() => setShowTemplates(true)}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus size={20} />
        </button>
      </div>

      {showTemplates && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Select Template</h4>
            <button
              onClick={() => setShowTemplates(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          <div className="space-y-2">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  createWorkflowFromTemplate(template.id, contactId);
                  setShowTemplates(false);
                }}
                className="w-full p-3 text-left bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{template.name}</span>
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
                {template.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {template.description}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {contactWorkflows.map((workflow) => (
          <div
            key={workflow.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow"
          >
            <div className="p-4 border-b dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">{workflow.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  workflow.status === 'active'
                    ? 'bg-green-100 text-green-600'
                    : workflow.status === 'paused'
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {workflow.status}
                </span>
              </div>
              {workflow.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {workflow.description}
                </p>
              )}
            </div>

            <div className="p-4 space-y-3">
              {workflow.steps.map((step) => (
                <div
                  key={step.id}
                  className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                    {getStepIcon(step.type)}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium">{step.title}</h5>
                    {step.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {step.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => updateWorkflowStep(workflow.id, step.id, {
                      status: step.status === 'completed' ? 'pending' : 'completed'
                    })}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                  >
                    {getStatusIcon(step.status)}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}