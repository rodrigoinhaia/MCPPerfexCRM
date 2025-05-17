import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { AuthService } from '../services/auth.service.js';
import { logger } from '../utils/logger.js';

export function setupAuthTools(server: McpServer) {
  const authService = new AuthService();

  server.tool(
    'validate-perfex-auth',
    {
      apiKey: z.string().optional(),
    },
    async ({ apiKey }) => {
      try {
        const isValid = await authService.validateApiKey(apiKey);
        return {
          content: [
            {
              type: 'text',
              text: isValid
                ? 'API key is valid'
                : 'API key is invalid or there was an error validating it',
            },
          ],
        };
      } catch (error) {
        logger.error('Error validating API key:', error);
        return {
          content: [
            {
              type: 'text',
              text: 'Error validating API key',
            },
          ],
        };
      }
    }
  );
} 