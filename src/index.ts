import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { config } from 'dotenv';
import { logger } from './utils/logger.js';
import { setupCustomerTools } from './tools/customer.tools.js';
import { setupAuthTools } from './tools/auth.tools.js';

// Load environment variables
config();

async function main() {
  try {
    const app = express();
    app.use(express.json());

    // Create MCP Server instance
    const server = new McpServer({
      name: 'perfex-mcp-server',
      version: '1.0.0'
    });

    // Setup tools
    setupAuthTools(server);
    setupCustomerTools(server);

    // Store transports for each session
    const transports = {
      sse: {} as Record<string, SSEServerTransport>
    };

    // Server information endpoint
    app.get('/', (req, res) => {
      const serverInfo = {
        name: 'PerfexCRM MCP Server',
        version: '1.0.0',
        description: 'MCP Server for PerfexCRM API integration with N8N',
        endpoints: {
          sse: '/sse',
          messages: '/messages',
          tools: '/tools'
        },
        documentation: {
          sse: 'Endpoint for establishing SSE connection with N8N',
          messages: 'Endpoint for handling messages from N8N',
          tools: 'Endpoint for listing available tools'
        }
      };
      res.json(serverInfo);
    });

    // List available tools
    app.get('/tools', (req, res) => {
      const tools = [
        {
          name: 'validate-perfex-auth',
          description: 'Validates the PerfexCRM API key',
          parameters: {
            apiKey: {
              type: 'string',
              description: 'API key to validate',
              optional: true
            }
          }
        },
        {
          name: 'list-customers',
          description: 'Lists all customers',
          parameters: {}
        },
        {
          name: 'get-customer',
          description: 'Gets a customer by ID',
          parameters: {
            id: {
              type: 'number',
              description: 'Customer ID'
            }
          }
        },
        {
          name: 'create-customer',
          description: 'Creates a new customer',
          parameters: {
            customer: {
              type: 'object',
              description: 'Customer data',
              properties: {
                company: { type: 'string' },
                vat: { type: 'string' },
                phonenumber: { type: 'string' },
                country: { type: 'number' },
                city: { type: 'string' },
                zip: { type: 'string' },
                state: { type: 'string' },
                address: { type: 'string' },
                email: { type: 'string' },
                custom_fields: { type: 'object', optional: true }
              }
            }
          }
        },
        {
          name: 'update-customer',
          description: 'Updates an existing customer',
          parameters: {
            id: {
              type: 'number',
              description: 'Customer ID'
            },
            customer: {
              type: 'object',
              description: 'Customer data to update',
              properties: {
                company: { type: 'string', optional: true },
                vat: { type: 'string', optional: true },
                phonenumber: { type: 'string', optional: true },
                country: { type: 'number', optional: true },
                city: { type: 'string', optional: true },
                zip: { type: 'string', optional: true },
                state: { type: 'string', optional: true },
                address: { type: 'string', optional: true },
                email: { type: 'string', optional: true },
                custom_fields: { type: 'object', optional: true }
              }
            }
          }
        },
        {
          name: 'delete-customer',
          description: 'Deletes a customer',
          parameters: {
            id: {
              type: 'number',
              description: 'Customer ID'
            }
          }
        }
      ];
      res.json(tools);
    });

    // Setup SSE transport
    app.get('/sse', async (req, res) => {
      const transport = new SSEServerTransport('/messages', res);
      transports.sse[transport.sessionId] = transport;
      
      res.on("close", () => {
        delete transports.sse[transport.sessionId];
      });
      
      await server.connect(transport);
    });

    // Handle messages
    app.post('/messages', async (req, res) => {
      const sessionId = req.query.sessionId as string;
      const transport = transports.sse[sessionId];
      if (transport) {
        await transport.handlePostMessage(req, res, req.body);
      } else {
        res.status(400).send('No transport found for sessionId');
      }
    });

    // Start server
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
    app.listen(port, () => {
      logger.info(`MCP Server started on port ${port}`);
      logger.info(`Server information available at: http://localhost:${port}`);
      logger.info(`Available tools at: http://localhost:${port}/tools`);
    });
  } catch (error) {
    logger.error('Failed to start MCP Server:', error);
    process.exit(1);
  }
}

main(); 