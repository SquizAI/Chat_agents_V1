import { Buffer } from 'buffer';

export class EncryptionService {
  private static instance: EncryptionService;
  private key: CryptoKey | null = null;

  private constructor() {}

  static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  async initialize() {
    if (this.key) return;

    const keyMaterial = await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );

    this.key = keyMaterial;
  }

  async encrypt(data: string): Promise<string> {
    if (!this.key) {
      await this.initialize();
    }

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(data);

    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      this.key!,
      encodedData
    );

    const encryptedArray = new Uint8Array(encryptedData);
    const combined = new Uint8Array(iv.length + encryptedArray.length);
    combined.set(iv);
    combined.set(encryptedArray, iv.length);

    return Buffer.from(combined).toString('base64');
  }

  async decrypt(encryptedData: string): Promise<string> {
    if (!this.key) {
      await this.initialize();
    }

    const combined = Buffer.from(encryptedData, 'base64');
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decryptedData = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      this.key!,
      data
    );

    return new TextDecoder().decode(decryptedData);
  }
}

export const encryptionService = EncryptionService.getInstance();