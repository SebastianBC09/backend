import { registerAs } from '@nestjs/config';
import { Connection } from 'mongoose';

export default registerAs('database', () => ({
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/shopping_cart',
  uriTest:
    process.env.MONGODB_URI_TEST ||
    'mongodb://localhost:27017/shopping_cart_test',
  options: {
    retryAttempts: 3,
    retryDelay: 3000,
    useFactory: (connection: Connection) => {
      connection.on('connected', () => {
        console.log('✅ MongoDB connected successfully');
      });
      connection.on('disconnected', () => {
        console.log('❌ MongoDB disconnected');
      });
      connection.on('error', (error: any) => {
        console.error('❌ MongoDB connection error:', error);
      });
      return connection;
    },
  },
}));
