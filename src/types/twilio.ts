export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
}

export interface CallRecord {
  id: string;
  contactId: string;
  timestamp: Date;
  duration: number;
  recordingUrl?: string;
  transcript?: string;
  summary?: string;
  notes?: string;
  tags: string[];
}

export interface MessageRecord {
  id: string;
  contactId: string;
  timestamp: Date;
  direction: 'inbound' | 'outbound';
  content: string;
  status: 'sent' | 'delivered' | 'failed';
  tags: string[];
}