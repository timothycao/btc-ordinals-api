import express from 'express';
import { PORT } from './shared/config';
import collectionsRouter from './collections/routes';
import rankingsRouter from './rankings/routes';

// Initialize Express app
const app = express();

// Add middleware to parse JSON requests
app.use(express.json());

// Add routes
app.use('/collections', collectionsRouter);
app.use('/rankings', rankingsRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});