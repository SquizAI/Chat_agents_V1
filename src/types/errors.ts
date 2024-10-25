export class TwilioError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details: Record<string, any> = {}
  ) {
    super(message);
    this.name = 'TwilioError';
  }
}

export class AIError extends Error {
  constructor(
    message: string,
    public code: string,
    public details: Record<string, any> = {}
  ) {
    super(message);
    this.name = 'AIError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public details: Record<string, any> = {}
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class CommunicationError extends Error {
  constructor(
    message: string,
    public code: string,
    public details: Record<string, any> = {}
  ) {
    super(message);
    this.name = 'CommunicationError';
  }
}