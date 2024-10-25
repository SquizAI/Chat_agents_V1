import React, { useState } from 'react';
import { Search, Plus, Tag, Phone, Mail, Edit, Trash2, MessageSquare, Bell, CheckSquare } from 'lucide-react';
import { useContactsStore } from '../store/slices/contactsSlice';
import WorkflowPanel from './WorkflowPanel';
import { Contact } from '../types';

export default function ContactsPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const { contacts, addContact } = useContactsStore();

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full bg-white dark:bg-gray-800">
      <div className="w-1/2 border-r dark:border-gray-700">
        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <button 
              onClick={() => setShowForm(true)}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                selectedContact?.id === contact.id ? 'bg-blue-50 dark:bg-blue-900/50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-300 font-semibold">
                    {contact.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{contact.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Phone size={14} />
                    <span>{contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Mail size={14} />
                    <span>{contact.email}</span>
                  </div>
                </div>
              </div>
              {contact.tags.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <Tag size={14} className="text-gray-400" />
                  <div className="flex gap-1">
                    {contact.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="w-1/2 p-4 overflow-y-auto">
        {selectedContact ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">{selectedContact.name}</h2>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <Edit size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <Trash2 size={20} className="text-red-500" />
                </button>
              </div>
            </div>
            
            <WorkflowPanel contactId={selectedContact.id} />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a contact to view details and workflows
          </div>
        )}
      </div>
    </div>
  );
}