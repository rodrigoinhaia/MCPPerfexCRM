import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CustomerService, Customer } from '../services/customer.service.js';
import { logger } from '../utils/logger.js';

export function setupCustomerTools(server: McpServer) {
  const customerService = new CustomerService();

  // List Customers
  server.tool(
    'list-customers',
    {},
    async () => {
      try {
        const customers = await customerService.getCustomers();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(customers, null, 2),
            },
          ],
        };
      } catch (error) {
        logger.error('Error listing customers:', error);
        return {
          content: [
            {
              type: 'text',
              text: 'Error listing customers',
            },
          ],
        };
      }
    }
  );

  // Get Customer by ID
  server.tool(
    'get-customer',
    {
      id: z.number(),
    },
    async ({ id }) => {
      try {
        const customer = await customerService.getCustomer(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(customer, null, 2),
            },
          ],
        };
      } catch (error) {
        logger.error(`Error getting customer ${id}:`, error);
        return {
          content: [
            {
              type: 'text',
              text: `Error getting customer ${id}`,
            },
          ],
        };
      }
    }
  );

  // Create Customer
  server.tool(
    'create-customer',
    {
      customer: z.object({
        company: z.string(),
        vat: z.string(),
        phonenumber: z.string(),
        country: z.number(),
        city: z.string(),
        zip: z.string(),
        state: z.string(),
        address: z.string(),
        email: z.string(),
        custom_fields: z.record(z.any()).optional(),
      }),
    },
    async ({ customer }) => {
      try {
        const newCustomer = await customerService.createCustomer(customer);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(newCustomer, null, 2),
            },
          ],
        };
      } catch (error) {
        logger.error('Error creating customer:', error);
        return {
          content: [
            {
              type: 'text',
              text: 'Error creating customer',
            },
          ],
        };
      }
    }
  );

  // Update Customer
  server.tool(
    'update-customer',
    {
      id: z.number(),
      customer: z.object({
        company: z.string().optional(),
        vat: z.string().optional(),
        phonenumber: z.string().optional(),
        country: z.number().optional(),
        city: z.string().optional(),
        zip: z.string().optional(),
        state: z.string().optional(),
        address: z.string().optional(),
        email: z.string().optional(),
        custom_fields: z.record(z.any()).optional(),
      }),
    },
    async ({ id, customer }) => {
      try {
        const updatedCustomer = await customerService.updateCustomer(id, customer);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(updatedCustomer, null, 2),
            },
          ],
        };
      } catch (error) {
        logger.error(`Error updating customer ${id}:`, error);
        return {
          content: [
            {
              type: 'text',
              text: `Error updating customer ${id}`,
            },
          ],
        };
      }
    }
  );

  // Delete Customer
  server.tool(
    'delete-customer',
    {
      id: z.number(),
    },
    async ({ id }) => {
      try {
        await customerService.deleteCustomer(id);
        return {
          content: [
            {
              type: 'text',
              text: `Customer ${id} deleted successfully`,
            },
          ],
        };
      } catch (error) {
        logger.error(`Error deleting customer ${id}:`, error);
        return {
          content: [
            {
              type: 'text',
              text: `Error deleting customer ${id}`,
            },
          ],
        };
      }
    }
  );
} 