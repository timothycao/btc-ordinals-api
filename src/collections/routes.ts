import { Router } from 'express';

// Create Express router instance
const router = Router();

// GET /collections endpoint
router.get('/', (req, res) => {
    res.send('Hello world!');
});

// Export router
export default router;