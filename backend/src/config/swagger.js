const swaggerJsdoc = require('swagger-jsdoc');

/**
 * Swagger/OpenAPI Configuration
 */
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PGAS Solution - API Documentation',
      version: '1.0.0',
      description: 'REST API for Employee, Department & Spending Management System. Built with Express.js + MySQL.',
      contact: {
        name: 'Fikri',
        email: 'fikri@heyfik.net'
      }
    },
    servers: [
      {
        url: '/api',
        description: 'API Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token'
        }
      },
      schemas: {
        Department: {
          type: 'object',
          properties: {
            department_id: { type: 'integer', example: 1 },
            department_name: { type: 'string', example: 'Engineering' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Employee: {
          type: 'object',
          properties: {
            employee_id: { type: 'integer', example: 1 },
            employee_name: { type: 'string', example: 'Ahmad Fauzi' },
            department_id: { type: 'integer', example: 3 },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Spending: {
          type: 'object',
          properties: {
            spending_id: { type: 'integer', example: 1 },
            employee_id: { type: 'integer', example: 1 },
            spending_date: { type: 'string', format: 'date', example: '2024-01-15' },
            value: { type: 'number', format: 'decimal', example: 250000.00 },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'admin@pgastest.com' },
            password: { type: 'string', example: 'admin123' }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                token: { type: 'string' },
                user: {
                  type: 'object',
                  properties: {
                    user_id: { type: 'integer' },
                    username: { type: 'string' },
                    email: { type: 'string' },
                    role: { type: 'string', enum: ['admin', 'user'] }
                  }
                }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
