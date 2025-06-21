// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

// Export configuration constants
export const PORT = process.env.PORT || 3000;
export const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';