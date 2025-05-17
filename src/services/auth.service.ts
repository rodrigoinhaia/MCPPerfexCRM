import axios from 'axios';
import { logger } from '../utils/logger.js';

export class AuthService {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    this.apiUrl = process.env.PERFEX_API_URL || '';
    this.apiKey = process.env.PERFEX_API_KEY || '';

    if (!this.apiUrl) {
      throw new Error('PERFEX_API_URL must be set in environment variables');
    }
  }

  async validateApiKey(apiKey?: string): Promise<boolean> {
    try {
      const key = apiKey || this.apiKey;
      if (!key) {
        throw new Error('No API key provided');
      }

      const response = await axios.get(`${this.apiUrl}/authentication`, {
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        }
      });

      return response.status === 200;
    } catch (error) {
      logger.error('Failed to validate API key:', error);
      return false;
    }
  }

  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }
} 