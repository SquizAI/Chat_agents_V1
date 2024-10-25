import React, { useState } from 'react';
import { Plus, Bell, Calendar, Clock, Check } from 'lucide-react';
import { useRemindersStore } from '../store/slices/remindersSlice';
import { format } from 'date-fns';

export default function RemindersPanel() {
  const { reminders, addReminder, completeReminder } = useRemindersStore();
  const [showNewReminder, setShowNewReminder] = useState(false);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Reminders</h2>
          <button
            onClick={() => setShowNewReminder(true)}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {reminders.map((reminder) => (
          <div
            key={reminder.id}
            className="p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => completeReminder(reminder.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  reminder.status === 'completed'
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-300 hover:border-blue-500'
                }`}
              >
                {reminder.status === 'completed' && (
                  <Check size={14} className="text-white" />
                )}
              </button>
              
              <div className="flex-1">
                <h3 className="font-semibold">{reminder.title}</h3>
                {reminder.description && (
                  <p className="text-sm text-gray-500">{reminder.description}</p>
                )}
                
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{format(reminder.dueDate, 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{format(reminder.dueDate, 'h:mm a')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bell size={14} />
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      reminder.priority === 'high' ? 'bg-red-100 text-red-600' :
                      reminder.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {reminder.priority}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}