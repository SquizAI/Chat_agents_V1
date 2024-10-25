import { create } from 'zustand';
import { Reminder } from '../../types';

interface RemindersState {
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  completeReminder: (id: string) => void;
  getContactReminders: (contactId: string) => Reminder[];
}

export const useRemindersStore = create<RemindersState>((set, get) => ({
  reminders: [],
  
  addReminder: (reminder) =>
    set((state) => ({
      reminders: [
        ...state.reminders,
        {
          ...reminder,
          id: crypto.randomUUID(),
        },
      ],
    })),
    
  updateReminder: (id, updates) =>
    set((state) => ({
      reminders: state.reminders.map((reminder) =>
        reminder.id === id ? { ...reminder, ...updates } : reminder
      ),
    })),
    
  deleteReminder: (id) =>
    set((state) => ({
      reminders: state.reminders.filter((reminder) => reminder.id !== id),
    })),
    
  completeReminder: (id) =>
    set((state) => ({
      reminders: state.reminders.map((reminder) =>
        reminder.id === id
          ? { ...reminder, status: 'completed' }
          : reminder
      ),
    })),
    
  getContactReminders: (contactId) =>
    get().reminders.filter((reminder) => reminder.contactId === contactId),
}));