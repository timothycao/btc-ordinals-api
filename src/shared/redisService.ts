// Reference: https://redis.io/docs/latest/develop/clients/nodejs/
import { createClient } from 'redis';
import { REDIS_URL } from './config';

// Create Redis client
const client = createClient({ url: REDIS_URL });

// Handle connection errors
client.on('error', err => console.log('Redis Client Error', err));

// Start connection
client.connect();

// Export client
export default client;