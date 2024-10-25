import React, { useState } from 'react';
import { Phone, Mail, MessageSquare, Edit, Trash2, Tag, Plus } from 'lucide-react';
import { Contact } from '../types';
import { useContactsStore } from '../store/slices/contactsSlice';
import { useCommunicationStore } from '../store/slices/communicationSlice';
import CallControls from './CallControls';

interface ContactDetailProps {
  contact: Contact;
}

export default function ContactDetail({ contact }: ContactDetailProps) {
  const [showCallControls, setShowCallControls] = useState(false);
  const [newTag, setNewTag] = useState('');
  const { updateContact, addTagToContact, removeTagFromContact } = useContactsStore();
  const { calls, messages } = useCommunicationStore(state => 
    state.getContactCommunication(contact.id)
  );

  const handleCallSummary = (summary: string) => {
    const currentNotes = contact.notes || '';
    const timestamp = new Date().toLocaleString();
    const newNote = `[${timestamp}] Call Summary:\n${summary}\n\n`;
    
    updateContact(contact.id, {
      notes: newNote + currentNotes,
      lastContacted: new Date()
    });
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim()) {
      addTagToContact(contact.id, newTag.trim());
      setNewTag('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold">{contact.name}</h2>
          {contact.phone && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Phone size={16} />
              <span>{contact.phone}</span>
            </div>
          )}
          {contact.email && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Mail size={16} />
              <span>{contact.email}</span>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <Edit size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <Trash2 size={20} className="text-red-500" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {contact.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm flex items-center gap-1"
          >
            <Tag size={14} />
            {tag}
            <button
              onClick={() => removeTagFromContact(contact.id, tag)}
              className="ml-1 hover:text-blue-800 dark:hover:text-blue-200"
            >
              ×
            </button>
          </span>
        ))}
        <form onSubmit={handleAddTag} className="flex items-center">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add tag..."
            className="px-2 py-1 text-sm border rounded-l-lg dark:bg-gray-700 dark:border-gray-600"
          />
          <button
            type="submit"
            className="px-2 py-1 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
          >
            <Plus size={14} />
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Communication</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCallControls(!showCallControls)}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Phone size={20} />
            </button>
            <button className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              <MessageSquare size={20} />
            </button>
          </div>
        </div>

        {showCallControls && (
          <CallControls
            phoneNumber={contact.phone || ''}
            onCallStart={() => {}}
            onCallEnd={() => {}}
            onSummaryReceived={handleCallSummary}
          />
        )}

        <div className="border dark:border-gray-700 rounded-lg">
          <div className="p-4 border-b dark:border-gray-700">
            <h4 className="font-medium">Notes & Call Summaries</h4>
          </div>
          <div className="p-4">
            {contact.notes ? (
              <pre className="whitespace-pre-wrap font-sans">{contact.notes}</pre>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No notes yet</p>
            )}
          </div>
        </div>

        <div className="border dark:border-gray-700 rounded-lg">
          <div className="p-4 border-b dark:border-gray-700">
            <h4 className="font-medium">Recent Activity</h4>
          </div>
          <div className="divide-y dark:divide-gray-700">
            {[...calls, ...messages]
              .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
              .map((item) => (
                <div key={item.id} className="p-4">
                  <div className="flex items-center gap-2">
                    {'content' in item ? (
                      <MessageSquare size={16} className="text-green-500" />
                    ) : (
                      <Phone size={16} className="text-blue-500" />
                    )}
                    <span className="text-sm text-gray-500">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {'content' in item && (
                    <p className="mt-1">{item.content}</p>
                  )}
                  {'summary' in item && item.summary && (
                    <p className="mt-1 text-gray-600 dark:text-gray-300">{item.summary}</p>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}