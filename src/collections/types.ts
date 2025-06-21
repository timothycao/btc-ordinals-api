// Used for GET /collections/:slug
export interface Collection {
    collection_name: string;
    floor_price: number;
    volume: number;
    total_listings: number;
    image_url: string;

    // Additional stats
    cohort: string;
    collection_symbol: string;
    collection_id: string;
    total_volume: number;
    total_transactions: number;
    volume_percent_change: number;
    transactions: number;
    transactions_percent_change: number;
    floor_price_percent_change: number;
    minted: number;
    minted_volume: number;
    floor_price_listing_price: number;
    floor_price_listing_currency: string;
    highest_global_offer_bid_currency: string;
    market_cap: number;
    total_supply: number;
    owner_count: number;
    unique_owner_ratio: number;
    is_compressed: boolean;
    has_inscriptions: boolean;
    currency: string;
    pending: number;
    currency_usd_rate: number;
    market_cap_usd: number;
    floor_price_spark_line_path: string;
}

// Used for GET /collections
export type CollectionSummary = Pick<
    Collection,
    'collection_name' | 'floor_price' | 'volume' | 'total_listings' | 'image_url'
>;

export interface FilterOptions {
    min_volume?: number;
    sort_by?: 'floor_price' | 'volume';
}