import { Router, Request, Response } from 'express';
import { getCollections } from '../collections/service';
import { FilterOptions } from '../collections/types';

// Create Express router instance
const router = Router();

// GET /rankings?sort_by=volume
router.get('/', async (req: Request, res: Response) => {
    try {
        // Extract and validate query parameter
        const sort_by = (req.query.sort_by as 'floor_price' | 'volume') || 'volume';    // Default to 'volume'
        const filters: FilterOptions = { sort_by };

        // Call getCollections service with filters
        console.log('Calling getCollections service with filters:', filters);
        const collections = await getCollections(filters);

        // Get top 10 collections
        console.log('Selecting top 10 collections...');
        const top10 = collections.slice(0, 10);

        // Format API response fields to match requirement spec
        const formatted = top10.map(c => ({
            collection_name: c.collection_name,
            floor_price: c.floor_price,
            '24h_volume': c.volume,     // Required key name
            total_listings: c.total_listings,
            image_url: c.image_url
        }));
        
        res.json(formatted);
    } catch (error: any) {
        // Handle and propagate errors
        const status = error.status || 500;
        const source = error.source || 'Server';
        const message = error.message || 'Unexpected server error';

        console.error('GET /rankings error:', error);
        res.status(status).json({ source, error: message });
        
    }
});

// Export router
export default router;