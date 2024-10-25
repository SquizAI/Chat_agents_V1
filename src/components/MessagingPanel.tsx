import React, { useState, useEffect } from 'react';
import { Search, Phone, Video, MoreVertical, MessageSquare } from 'lucide-react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useTranslation } from '../hooks/useTranslation';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { useAI } from '../contexts/AIContext';
import { useCommunicationStore } from '../store/slices/communicationSlice';
import { useContactsStore } from '../store/slices/contactsSlice';
import CallControls from './CallControls';
import ThemeSwitch from './ThemeSwitch';

export default function MessagingPanel() {
  const { t } = useTranslation();
  const { isListening, startListening, stopListening, transcript } = useVoiceInput();
  const { generateAIResponse } = useAI();
  const [showCallControls, setShowCallControls] = useState(false);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { messages, sendMessage } = useCommunicationStore();
  const { contacts } = useContactsStore();

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone?.includes(searchQuery)
  );

  const selectedContactMessages = messages.filter(msg => 
    msg.contactId === selectedContact
  ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const handleSendMessage = async (content: string) => {
    if (!selectedContact) return;
    
    const contact = contacts.find(c => c.id === selectedContact);
    if (!contact?.phone) return;

    await sendMessage(contact.phone, content);
  };

  const handleCallSummary = (summary: string) => {
    // Handle call summary
  };

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900">
      {/* Contact List Sidebar */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r dark:border-gray-700">
        <div className="p-4 border-b dark:border-gray-700">
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
          />
        </div>
        <div className="overflow-y-auto h-[calc(100vh-5rem)]">
          {filteredContacts.map(contact => (
            <button
              key={contact.id}
              onClick={() => setSelectedContact(contact.id)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                selectedContact === contact.id ? 'bg-blue-50 dark:bg-blue-900/50' : ''
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-300 font-semibold">
                  {contact.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold">{contact.name}</h3>
                <p className="text-sm text-gray-500">{contact.phone}</p>
              </div>
              {messages.some(m => m.contactId === contact.id && m.status === 'unread') && (
                <div className="w-3 h-3 rounded-full bg-blue-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          {selectedContact ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                <MessageSquare className="text-white" size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {contacts.find(c => c.id === selectedContact)?.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {contacts.find(c => c.id === selectedContact)?.phone}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">Messages</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Select a contact to start messaging</p>
            </div>
          )}
          
          <div className="flex items-center gap-4">
            <ThemeSwitch />
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowCallControls(!showCallControls)}
                className={`p-2 rounded-full transition-colors ${
                  showCallControls 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                <Phone size={20} />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <Video className="text-gray-600 dark:text-gray-300" size={20} />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <MoreVertical className="text-gray-600 dark:text-gray-300" size={20} />
              </button>
            </div>
          </div>
        </div>

        {showCallControls && selectedContact && (
          <CallControls
            phoneNumber={contacts.find(c => c.id === selectedContact)?.phone || ''}
            onCallStart={() => {}}
            onCallEnd={() => {}}
            onSummaryReceived={handleCallSummary}
          />
        )}

        <div className="flex-1 overflow-y-auto px-4 py-6">
          {selectedContact ? (
            <MessageList messages={selectedContactMessages} isTyping={false} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a contact to view messages
            </div>
          )}
        </div>

        {selectedContact && (
          <MessageInput
            onSend={handleSendMessage}
            isListening={isListening}
            onStartVoice={startListening}
            onStopVoice={stopListening}
            transcript={transcript}
          />
        )}
      </div>
    </div>
  );
}