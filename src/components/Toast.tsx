import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';
import { create } from 'zustand';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id: crypto.randomUUID() },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

const ToastIcon = ({ type }: { type: Toast['type'] }) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="text-green-500" size={20} />;
    case 'error':
      return <XCircle className="text-red-500" size={20} />;
    case 'warning':
      return <AlertCircle className="text-yellow-500" size={20} />;
    default:
      return <Info className="text-blue-500" size={20} />;
  }
};

function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useToastStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, removeToast]);

  return (
    <div
      className={`flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-l-4 ${
        toast.type === 'success' ? 'border-green-500' :
        toast.type === 'error' ? 'border-red-500' :
        toast.type === 'warning' ? 'border-yellow-500' :
        'border-blue-500'
      }`}
    >
      <ToastIcon type={toast.type} />
      <p className="flex-1">{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
      >
        ×
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}