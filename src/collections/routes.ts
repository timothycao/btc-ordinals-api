import { Router, Request, Response } from 'express';
import { getCollections, getCollectionBySlug } from './service';
import { FilterOptions } from './types';

// Create Express router instance
const router = Router();

// GET /collections?min_volume=0.01&sort_by=volume
router.get('/', async (req: Request, res: Response) => {
    try {
        // Extract and validate query parameters
        const min_volume = req.query.min_volume ? parseFloat(req.query.min_volume as string) : undefined;
        const sort_by = req.query.sort_by as 'floor_price' | 'volume' | undefined;
        const filters: FilterOptions = { min_volume, sort_by };

        // Call getCollections service with filters
        console.log('Calling getCollections service with filters:', filters);
        const collections = await getCollections(filters);

        // Format API response fields to match requirement spec
        const formatted = collections.map(c => ({
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

        console.error('GET /collections error:', error);
        res.status(status).json({ source, error: message });
    }
});

// GET /collections/:bitcoin-frogs
router.get('/:slug', async (req: Request, res: Response) => {
    try {
        const slug = req.params.slug;

        // Fetch detailed collections stats by slug
        const collection = await getCollectionBySlug(slug)

        res.json(collection);
    } catch (error: any) {
        // Handle and propagate errors
        const status = error.status || 500;
        const source = error.source || 'Server';
        const message = error.message || 'Unexpected server error';
        
        console.error('GET /collections/:slug error:', error);
        res.status(status).json({ source, error: message });
    }
});

// Export router
export default router;