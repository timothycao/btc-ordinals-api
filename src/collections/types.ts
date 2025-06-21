export interface Collection {
    collection_name: string;
    floor_price: number;
    volume: number;
    total_listings: number;
    image_url: string;
}

export interface FilterOptions {
    min_volume?: number;
    sort_by?: 'floor_price' | 'volume';
}