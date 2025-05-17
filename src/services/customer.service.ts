import axios from 'axios';
import { AuthService } from './auth.service.js';
import { logger } from '../utils/logger.js';

export interface Customer {
  id?: number;
  company: string;
  vat: string;
  phonenumber: string;
  country: number;
  city: string;
  zip: string;
  state: string;
  address: string;
  email: string;
  custom_fields?: Record<string, any>;
}

export class CustomerService {
  private apiUrl: string;
  private authService: AuthService;

  constructor() {
    this.apiUrl = process.env.PERFEX_API_URL || '';
    this.authService = new AuthService();
  }

  async getCustomers(): Promise<Customer[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/customers`, {
        headers: this.authService.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to get customers:', error);
      throw error;
    }
  }

  async getCustomer(id: number): Promise<Customer> {
    try {
      const response = await axios.get(`${this.apiUrl}/customers/${id}`, {
        headers: this.authService.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      logger.error(`Failed to get customer ${id}:`, error);
      throw error;
    }
  }

  async createCustomer(customer: Customer): Promise<Customer> {
    try {
      const response = await axios.post(`${this.apiUrl}/customers`, customer, {
        headers: this.authService.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to create customer:', error);
      throw error;
    }
  }

  async updateCustomer(id: number, customer: Partial<Customer>): Promise<Customer> {
    try {
      const response = await axios.put(`${this.apiUrl}/customers/${id}`, customer, {
        headers: this.authService.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      logger.error(`Failed to update customer ${id}:`, error);
      throw error;
    }
  }

  async deleteCustomer(id: number): Promise<void> {
    try {
      await axios.delete(`${this.apiUrl}/customers/${id}`, {
        headers: this.authService.getAuthHeaders(),
      });
    } catch (error) {
      logger.error(`Failed to delete customer ${id}:`, error);
      throw error;
    }
  }
} 