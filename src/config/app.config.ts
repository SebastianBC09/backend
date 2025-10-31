import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  apiPrefix: process.env.API_PREFIX || 'api/v1',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  swagger: {
    enabled: process.env.SWAGGER_ENABLED === 'true',
    title: 'Shopping Cart API',
    description: 'RESTFul API for shopping cart management',
    version: '1.0',
    path: 'api/docs',
  },
}));
