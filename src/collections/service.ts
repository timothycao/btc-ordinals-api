import redisClient from "../shared/redisService";
import { fetchAllCollectionStats } from "../shared/magicEdenService";
import { Collection, FilterOptions } from "./types";

export async function getCollections(filters: FilterOptions): Promise<Collection[]> {
    try {
        let collections: Collection[];
        const cachedCollections = await redisClient.get('collections');

        // Check cache before fetching
        if (cachedCollections) {
            // Use cached collections
            console.log('Using collections from cache...');
            collections = JSON.parse(cachedCollections);
        } else {
            // Fetch collections from Magic Eden
            console.log('Fetching collections from Magic Eden...');
            const fetchedCollections = await fetchAllCollectionStats();

            // Reformat fetched collections
            console.log('Reformatting fetched collections...');
            collections = fetchedCollections.map((item: any) => ({
                collection_name: item.name,
                floor_price: item.fp,
                volume: item.vol,
                total_listings: item.listedCount,
                image_url: item.image
            }));

            // Cache for 1 hour
            console.log('Caching collections for 1 hour...');
            await redisClient.set('collections', JSON.stringify(collections), { EX: 3600 });
        }
        
        // Apply filters to the collections
        console.log('Filtering collections...');
        return applyFilters(collections, filters);
    } catch (error) {
        throw error;
    }
}

function applyFilters(collections: Collection[], filters: FilterOptions): Collection[] {
    let filteredCollections = [...collections];

    // Apply minimum volume filter
    if (filters.min_volume != undefined) {
        const min_volume = filters.min_volume;
        filteredCollections = filteredCollections.filter(c => c.volume >= min_volume);
    }

    // Apply sorting
    if (filters.sort_by == 'floor_price') {
        filteredCollections.sort((a, b) => b.floor_price - a.floor_price);
    } else if (filters.sort_by == 'volume') {
        // Optional (fetched collections are already sorted by volume)
        filteredCollections.sort((a, b) => b.volume - a.volume);
    }

    return filteredCollections;
}