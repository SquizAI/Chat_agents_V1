import { env } from '../config/env';
import { TwilioError } from '../types/errors';
import { Message } from '../types';

export class TwilioService {
  private baseUrl: string;
  private headers: HeadersInit;

  constructor() {
    if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN || !env.TWILIO_PHONE_NUMBER) {
      throw new TwilioError('Missing Twilio credentials', 500);
    }

    this.baseUrl = `${env.APP_URL}/.netlify/functions`;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  private async makeRequest(endpoint: string, params: Record<string, string>): Promise<Response> {
    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new TwilioError(
          `Twilio API error: ${errorData.message || response.statusText}`,
          response.status,
          errorData
        );
      }

      return response;
    } catch (error) {
      if (error instanceof TwilioError) {
        throw error;
      }
      throw new TwilioError(
        'Failed to connect to API',
        500,
        { originalError: error }
      );
    }
  }

  async sendVerification(phoneNumber: string): Promise<{ sid: string }> {
    try {
      const response = await this.makeRequest('twilio-send-verification', {
        to: this.validatePhoneNumber(phoneNumber)
      });

      const data = await response.json();
      return { sid: data.sid };
    } catch (error) {
      console.error('Verification send failed:', error);
      throw error instanceof TwilioError ? error : new TwilioError(
        'Failed to send verification',
        500,
        { originalError: error }
      );
    }
  }

  async checkVerification(phoneNumber: string, code: string): Promise<{ verified: boolean }> {
    try {
      const response = await this.makeRequest('twilio-check-verification', {
        to: this.validatePhoneNumber(phoneNumber),
        code
      });

      const data = await response.json();
      return { verified: data.valid };
    } catch (error) {
      console.error('Verification check failed:', error);
      throw error instanceof TwilioError ? error : new TwilioError(
        'Failed to check verification',
        500,
        { originalError: error }
      );
    }
  }

  async sendMessage(to: string, body: string): Promise<string> {
    try {
      const validatedNumber = this.validatePhoneNumber(to);
      const response = await this.makeRequest('twilio-send-message', {
        to: validatedNumber,
        from: env.TWILIO_PHONE_NUMBER,
        body
      });

      const data = await response.json();
      return data.sid;
    } catch (error) {
      console.error('Message sending failed:', error);
      throw error instanceof TwilioError ? error : new TwilioError(
        'Failed to send message',
        500,
        { originalError: error }
      );
    }
  }

  private validatePhoneNumber(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length < 10) {
      throw new TwilioError('Invalid phone number format', 400);
    }
    return cleaned.length === 10 ? `+1${cleaned}` : `+${cleaned}`;
  }
}

export const twilioService = new TwilioService();