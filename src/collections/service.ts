import redisClient from "../shared/redisService";
import { fetchAllCollectionStats } from "../shared/magicEdenService";
import { Collection, CollectionSummary, FilterOptions } from "./types";

export async function getCollections(filters: FilterOptions): Promise<CollectionSummary[]> {
    let collections: CollectionSummary[];

    const cached = await redisClient.get('collections');
    
    // Use cached collections if available
    if (cached) {
        console.log('Using collections from cache...');
        collections = JSON.parse(cached);
    } else {
        // Otherwise fetch and cache all collections
        const { summarized } = await fetchAndCacheCollections();
        collections = summarized;
    }
    
    // Apply filters
    console.log('Filtering collections...');
    return applyFilters(collections, filters);
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
    const cached = await redisClient.get(`collections:${slug}`);
    
    // Used cached collection if available
    if (cached) {
        console.log(`Using collection ${slug} from cache...`);
        return JSON.parse(cached);
    } else {
        // Otherwise fetch and cache all collections, then find by slug
        const { detailed } = await fetchAndCacheCollections();
        console.log(`Finding collection ${slug}...`);
        const collection = detailed.find(c => c.collection_symbol === slug);

        if (!collection) {
            throw {
                source: 'Collection Service',
                status: 404,
                message: `Collection ${slug} not found`
            }
        }

        return collection;
    }
}

async function fetchAndCacheCollections(): Promise<{ detailed: Collection[], summarized: CollectionSummary[] }> {
    // Fetch collections from Magic Eden
    console.log('Fetching collections from Magic Eden...');
    const raw = await fetchAllCollectionStats();

    // Reformat fetched collections to match Collection type
    console.log('Reformatting fetched collections...');
    const detailed: Collection[] = raw.map((item: any) => ({
        collection_name: item.name,
        floor_price: item.fp,
        volume: item.vol,
        total_listings: item.listedCount,
        image_url: item.image,
        cohort: item.cohort,
        collection_symbol: item.collectionSymbol,
        collection_id: item.collectionId,
        total_volume: item.totalVol,
        total_transactions: item.totalTxns,
        volume_percent_change: item.volPctChg,
        transactions: item.txns,
        transactions_percent_change: item.txnsPctChg,
        floor_price_percent_change: item.fpPctChg,
        minted: item.minted,
        minted_volume: item.mintedVol,
        floor_price_listing_price: item.fpListingPrice,
        floor_price_listing_currency: item.fpListingCurrency,
        highest_global_offer_bid_currency: item.highestGlobalOfferBidCurrency,
        market_cap: item.marketCap,
        total_supply: item.totalSupply,
        owner_count: item.ownerCount,
        unique_owner_ratio: item.uniqueOwnerRatio,
        is_compressed: item.isCompressed,
        has_inscriptions: item.hasInscriptions,
        currency: item.currency,
        pending: item.pending,
        currency_usd_rate: item.currencyUsdRate,
        market_cap_usd: item.marketCapUsd,
        floor_price_spark_line_path: item.fpSparkLinePath,
    }));

    // Reformat to match CollectionSummary type
    const summarized: CollectionSummary[] = detailed.map(c => ({
        collection_name: c.collection_name,
        floor_price: c.floor_price,
        volume: c.volume,
        total_listings: c.total_listings,
        image_url: c.image_url
    }));

    // Cache summarized collections in a list
    console.log('Caching collections...');
    await redisClient.set('collections', JSON.stringify(summarized), { EX: 3600 });

    // Cache each collection by slug
    await Promise.all(
        detailed.map(c => 
            redisClient.set(`collections:${c.collection_symbol}`, JSON.stringify(c), { EX: 3600 })
        )
    );

    return { detailed, summarized };
}

function applyFilters(collections: CollectionSummary[], filters: FilterOptions): CollectionSummary[] {
    let filtered = [...collections];

    // Apply minimum volume filter
    if (filters.min_volume != undefined) {
        const min_volume = filters.min_volume;
        filtered = filtered.filter(c => c.volume >= min_volume);
    }

    // Apply sorting
    if (filters.sort_by == 'floor_price') {
        filtered.sort((a, b) => b.floor_price - a.floor_price);
    } else if (filters.sort_by == 'volume') {
        // Optional (fetched collections are already sorted by volume)
        filtered.sort((a, b) => b.volume - a.volume);
    }

    return filtered;
}