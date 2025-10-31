import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/shopping_cart',
  uriTest:
    process.env.MONGODB_URI_TEST ||
    'mongodb://localhost:27017/shopping_cart_test',
  options: {
    retryAttempts: 3,
    retryDelay: 3000,
  },
}));
