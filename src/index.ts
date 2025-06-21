import express from 'express';
import { PORT } from './shared/config';
import collectionsRouter from './collections/routes';

// Initialize Express app
const app = express();

// Add middleware to parse JSON requests
app.use(express.json());

// Add /collections route
app.use('/collections', collectionsRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});