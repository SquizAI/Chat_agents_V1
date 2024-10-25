import { create } from 'zustand';
import { Contact } from '../../types';

interface ContactsState {
  contacts: Contact[];
  selectedContact: Contact | null;
  addContact: (contact: Omit<Contact, 'id'>) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  setSelectedContact: (contact: Contact | null) => void;
  addTagToContact: (contactId: string, tag: string) => void;
  removeTagFromContact: (contactId: string, tag: string) => void;
}

export const useContactsStore = create<ContactsState>((set) => ({
  contacts: [{
    id: 'matty-001',
    name: 'Matty',
    email: '',
    phone: '+18173689117',
    tags: ['important'],
    category: 'personal',
    notes: '',
    reminders: [],
    lastContacted: new Date()
  }],
  selectedContact: null,
  
  addContact: (contact) =>
    set((state) => ({
      contacts: [
        ...state.contacts,
        {
          ...contact,
          id: crypto.randomUUID(),
          reminders: [],
        },
      ],
    })),
    
  updateContact: (id, updates) =>
    set((state) => ({
      contacts: state.contacts.map((contact) =>
        contact.id === id ? { ...contact, ...updates } : contact
      ),
    })),
    
  deleteContact: (id) =>
    set((state) => ({
      contacts: state.contacts.filter((contact) => contact.id !== id),
      selectedContact: state.selectedContact?.id === id ? null : state.selectedContact,
    })),
    
  setSelectedContact: (contact) =>
    set({ selectedContact: contact }),
    
  addTagToContact: (contactId, tag) =>
    set((state) => ({
      contacts: state.contacts.map((contact) =>
        contact.id === contactId
          ? { ...contact, tags: [...new Set([...contact.tags, tag])] }
          : contact
      ),
    })),
    
  removeTagFromContact: (contactId, tag) =>
    set((state) => ({
      contacts: state.contacts.map((contact) =>
        contact.id === contactId
          ? { ...contact, tags: contact.tags.filter((t) => t !== tag) }
          : contact
      ),
    })),
}));