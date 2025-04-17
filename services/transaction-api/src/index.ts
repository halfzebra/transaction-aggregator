import express from 'express';
import rateLimit from 'express-rate-limit';
import { faker } from '@faker-js/faker';
import swaggerUi from 'swagger-ui-express';
import { OpenAPIV3 } from 'openapi-types';

const app = express();
const port = 3000;

// Rate limiting - 5 requests per minute
const transactionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: {
    status: 429,
    message:
      'Too many requests to /transactions endpoint. Please try again in 1 minute.',
  },
});

// Generate a pool of 10 users with UUIDs and balances
const users = Array.from({ length: 2 }, () => ({
  id: faker.string.uuid(),
  initialBalance: parseFloat(
    faker.finance.amount({ min: 1000, max: 10000, dec: 2 }),
  ),
}));

// Generate fake transaction with user from pool
const generateTransaction = () => {
  const user = faker.helpers.arrayElement(users);
  return {
    id: faker.string.uuid(),
    userId: user.id,
    createdAt: faker.date.recent().toISOString(),
    type: faker.helpers.arrayElement(['payout', 'spent', 'earned']),
    amount: parseFloat(faker.finance.amount({ min: 0, max: 1000, dec: 2 })),
  };
};

// OpenAPI specification
const openApiSpec: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'Transaction API',
    version: '1.0.0',
  },
  paths: {
    '/transactions': {
      get: {
        parameters: [
          {
            name: 'startDate',
            in: 'query',
            required: true,
            schema: { type: 'string', format: 'date-time' },
            example: '2024-04-01T00:00:00.000Z',
            description: 'Start date in ISO 8601 format',
          },
          {
            name: 'endDate',
            in: 'query',
            required: true,
            schema: { type: 'string', format: 'date-time' },
            example: '2024-04-17T23:59:59.999Z',
            description: 'End date in ISO 8601 format',
          },
        ],
        responses: {
          '200': {
            description: 'List of transactions',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    items: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          userId: { type: 'string' },
                          createdAt: { type: 'string' },
                          type: {
                            type: 'string',
                            enum: ['payout', 'spent', 'earned'],
                          },
                          amount: { type: 'number' },
                        },
                      },
                    },
                    meta: {
                      type: 'object',
                      properties: {
                        totalItems: { type: 'number' },
                        itemCount: { type: 'number' },
                        itemsPerPage: { type: 'number' },
                        totalPages: { type: 'number' },
                        currentPage: { type: 'number' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

// Transactions endpoint with rate limiting
app.get('/transactions', transactionLimiter, (req, res) => {
  const items = Array.from({ length: 3 }, generateTransaction);

  res.json({
    items,
    meta: {
      totalItems: 1200,
      itemCount: items.length,
      itemsPerPage: 3,
      totalPages: 400,
      currentPage: 1,
    },
  });
});

// Add users endpoint to see available test users
app.get('/users', (req, res) => {
  res.json({ users });
});

app.listen(port, () => {
  console.log('');
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log('');
  console.log(
    `API documentation available at http://localhost:${port}/api-docs`,
  );
  console.log('');
  console.log('Available test users:', users);
  console.log('');
});
