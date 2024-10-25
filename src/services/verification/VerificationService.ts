import { env } from '../../config/env';
import { TwilioError } from '../../types/errors';
import { twilioService } from '../twilio';

export class VerificationService {
  private static instance: VerificationService;
  private verificationAttempts: Map<string, number> = new Map();
  private readonly MAX_ATTEMPTS = 3;
  private readonly LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes
  private readonly CODE_LENGTH = 6;

  private constructor() {}

  static getInstance(): VerificationService {
    if (!VerificationService.instance) {
      VerificationService.instance = new VerificationService();
    }
    return VerificationService.instance;
  }

  async sendVerificationCode(phoneNumber: string): Promise<{ success: boolean; message: string }> {
    try {
      // Check if number is locked out
      if (this.isLockedOut(phoneNumber)) {
        return {
          success: false,
          message: 'Too many attempts. Please try again later.'
        };
      }

      const response = await twilioService.sendVerification(phoneNumber);
      
      return {
        success: true,
        message: 'Verification code sent successfully'
      };
    } catch (error) {
      console.error('Verification send error:', error);
      throw new TwilioError(
        'Failed to send verification code',
        500,
        { originalError: error }
      );
    }
  }

  async verifyCode(phoneNumber: string, code: string): Promise<{ 
    success: boolean; 
    message: string;
    verified?: boolean;
  }> {
    try {
      // Validate code format
      if (!this.isValidCode(code)) {
        return {
          success: false,
          message: `Code must be ${this.CODE_LENGTH} digits`
        };
      }

      // Check attempts
      if (this.isLockedOut(phoneNumber)) {
        return {
          success: false,
          message: 'Too many attempts. Please try again later.'
        };
      }

      const response = await twilioService.checkVerification(phoneNumber, code);
      
      if (response.verified) {
        // Reset attempts on success
        this.verificationAttempts.delete(phoneNumber);
        
        return {
          success: true,
          message: 'Phone number verified successfully',
          verified: true
        };
      }

      // Increment failed attempts
      this.incrementAttempts(phoneNumber);

      return {
        success: false,
        message: 'Invalid verification code',
        verified: false
      };
    } catch (error) {
      console.error('Verification check error:', error);
      throw new TwilioError(
        'Failed to verify code',
        500,
        { originalError: error }
      );
    }
  }

  private isValidCode(code: string): boolean {
    return /^\d{6}$/.test(code);
  }

  private isLockedOut(phoneNumber: string): boolean {
    const attempts = this.verificationAttempts.get(phoneNumber);
    if (!attempts) return false;

    const { count, timestamp } = attempts;
    const timePassed = Date.now() - timestamp;

    if (count >= this.MAX_ATTEMPTS && timePassed < this.LOCKOUT_DURATION) {
      return true;
    }

    if (timePassed >= this.LOCKOUT_DURATION) {
      this.verificationAttempts.delete(phoneNumber);
    }

    return false;
  }

  private incrementAttempts(phoneNumber: string): void {
    const attempts = this.verificationAttempts.get(phoneNumber);
    
    if (!attempts) {
      this.verificationAttempts.set(phoneNumber, {
        count: 1,
        timestamp: Date.now()
      });
      return;
    }

    this.verificationAttempts.set(phoneNumber, {
      count: attempts.count + 1,
      timestamp: Date.now()
    });
  }
}

export const verificationService = VerificationService.getInstance();