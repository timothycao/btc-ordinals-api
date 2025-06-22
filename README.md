# BTC Ordinals Market Data API

A TypeScript and Express API that fetches and serves Bitcoin Ordinals collection stats using Magic Eden’s public API. Includes Redis caching and Dockerized infrastructure for easy setup.

## Setup Instructions

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed

### Steps

1. Clone the repo:

```bash
git clone https://github.com/timothycao/btc-ordinals-api.git
cd btc-ordinals-api
```

2. Create .env file in the root directory:
```bash
echo -e "PORT=3000\nREDIS_URL=redis://redis:6379" > .env
```

3. Run the API:

```bash
docker compose up --build
```

This will:

- Build and start the API container (`http://localhost:3000`)
- Start Redis in a second container (available to the API via `redis://redis:6379`)

## API Endpoints

### `GET /collections`

Returns a list of all BTC Ordinals collections.

**Query Parameters:**

- `min_volume` (optional): Minimum 24h volume (e.g. `0.05`)
- `sort_by` (optional): `volume` or `floor_price`

**Example:**

```bash
curl http://localhost:3000/collections?min_volume=0.2&sort_by=volume
```

**Sample Response:**

```json
[
  {
    "collection_name": "Taproot Wizards",
    "floor_price": 0.16978,
    "24h_volume": 1.62183699,
    "total_listings": 204,
    "image_url": "https://creator-hub-prod.s3.us-east-2.amazonaws.com/ord-taproot_wizards_pfp_1740791107942.jpeg"
  },
  {
    "collection_name": "NodeMonkes",
    "floor_price": 0.0249,
    "24h_volume": 0.27537105,
    "total_listings": 1456,
    "image_url": "https://creator-hub-prod.s3.us-east-2.amazonaws.com/ord-nodemonkes_pfp_1733813805002.png"
  }
]
```

### `GET /collections/:slug`

Returns detailed stats for a specific collection.

**Example:**

```bash
curl http://localhost:3000/collections/bitcoin-frogs
```

**Sample Response:**

```json
{
  "collection_name": "Bitcoin Frogs",
  "floor_price": 0.00469,
  "volume": 0.05106413,
  "total_listings": 1160,
  "image_url": "https://bafkreigrsecff6opbrtnwwomzyom3yuwifbsdt6hnq5zn2q55wspx4hfiy.ipfs.nftstorage.link/",
  "cohort": "ordinal",
  "collection_symbol": "bitcoin-frogs",
  "collection_id": "bitcoin-frogs",
  "total_volume": 1545.02424231,
  "total_transactions": 21074,
  "volume_percent_change": -59.4029214,
  "transactions": 10,
  "transactions_percent_change": -62.96296296,
  "floor_price_percent_change": -4.1252708614416,
  "minted": 0,
  "minted_volume": 0,
  "floor_price_listing_price": 0.00469,
  "floor_price_listing_currency": "BTC",
  "highest_global_offer_bid_currency": "BTC",
  "market_cap": 46.9,
  "total_supply": 10000,
  "owner_count": 5422,
  "unique_owner_ratio": 0.5422,
  "is_compressed": false,
  "has_inscriptions": false,
  "currency": "BTC",
  "pending": 1,
  "currency_usd_rate": 102628.919640425,
  "market_cap_usd": 4813296.33113596,
  "floor_price_spark_line_path": "/collection_stats/getCollectionSparkline/bitcoin-frogs?cohort=ordinal&window=1d&currentFp=0.00469&fpPctChg=-4.125270861441599"
}
```

### `GET /rankings`

Returns the top 10 collections by `volume` (default) or `floor_price`.

**Query Parameters:**

- `sort_by` (optional): `volume` (default) or `floor_price`

**Example:**

```bash
curl http://localhost:3000/rankings?sort_by=floor_price
```

**Sample Response:**

```json
[
  {
    "collection_name": "Taproot Wizards",
    "floor_price": 0.16978,
    "24h_volume": 1.62183699,
    "total_listings": 204,
    "image_url": "https://creator-hub-prod.s3.us-east-2.amazonaws.com/ord-taproot_wizards_pfp_1740791107942.jpeg"
  },
  {
    "collection_name": "Bitcoin Puppets",
    "floor_price": 0.03069999,
    "24h_volume": 0.093461,
    "total_listings": 1163,
    "image_url": "https://bafkreicrzu7uzdfc7kblmyajxwzlfkbh6m4mi6lfzt5h42f7j7suie4od4.ipfs.nftstorage.link/"
  },
  {
    "collection_name": "Quantum Cats",
    "floor_price": 0.0251,
    "24h_volume": 0.14453989,
    "total_listings": 268,
    "image_url": "https://creator-hub-prod.s3.us-east-2.amazonaws.com/ord-taproot_wizards_presents_pfp_1706542390359.png"
  },
  {
    "collection_name": "NodeMonkes",
    "floor_price": 0.0249,
    "24h_volume": 0.27537105,
    "total_listings": 1456,
    "image_url": "https://creator-hub-prod.s3.us-east-2.amazonaws.com/ord-nodemonkes_pfp_1733813805002.png"
  },
  {
    "collection_name": "OCM Genesis by OnChainMonkey®",
    "floor_price": 0.02089999,
    "24h_volume": 0.02075,
    "total_listings": 448,
    "image_url": "https://creator-hub-prod.s3.us-east-2.amazonaws.com/ord-ocm-genesis_pfp_1744084567528.gif"
  },
  {
    "collection_name": "Pizza Ninjas",
    "floor_price": 0.01999,
    "24h_volume": 0.04087,
    "total_listings": 100,
    "image_url": "https://creator-hub-prod.s3.us-east-2.amazonaws.com/ord-pizza-ninjas_pfp_1711912845018.gif"
  },
  {
    "collection_name": "Ordinal Maxi Biz (OMB)",
    "floor_price": 0.0164,
    "24h_volume": 0.073,
    "total_listings": 768,
    "image_url": "https://bafybeidb7ltjitqivbcp22iktp5vmciee4dwzrjobwjnlzt5dkgyepj5ne.ipfs.nftstorage.link/"
  },
  {
    "collection_name": "Yokai Avengers",
    "floor_price": 0.0125,
    "24h_volume": 0.0111,
    "total_listings": 116,
    "image_url": "https://creator-hub-prod.s3.us-east-2.amazonaws.com/ord-yokai_avengers_pfp_1698054318287.png"
  },
  {
    "collection_name": "BTC Machines",
    "floor_price": 0.01198,
    "24h_volume": 0.01198,
    "total_listings": 46,
    "image_url": "https://bafkreicvs6kwwlzkkbrpl4ircduhiun7push6zgx3dzz5p7pjfrf3nwppm.ipfs.nftstorage.link/"
  },
  {
    "collection_name": "The Wizards of Ord",
    "floor_price": 0.01099,
    "24h_volume": 0.04149,
    "total_listings": 231,
    "image_url": "https://creator-hub-prod.s3.us-east-2.amazonaws.com/ord-wizards_pfp_1699090652197.png"
  }
]
```

## Trade-offs and Limitations

- **Data Source Constraints**
  - All data is fetched from Magic Eden's `https://api-mainnet.magiceden.dev/collection_stats/search/bitcoin` endpoint, the only working endpoint for BTC Ordinals Collections at the time of development (the others only returned status 429).
  - This endpoint supports pagination with `offset` and `limit` parameters, each ranging from 1-1000, which implies that at most 2000 collections can be retrieved (may not scale in the long term).
  - Since there are currently fewer than 200 collections in the Magic Eden database, this implementation uses a single bulk fetch with `limit=1000` to retrieve all data in one call.

- **Caching Strategy**
  - Redis is used as an in-memory cache, and no persistent database is involved.
  - Collections are cached both:
    - As a full list of summarized stats (`collections`)
    - Individually by slug with full stats (`collections:{slug}`)
  - This dual caching strategy duplicates data and incurs a linear runtime on refresh, but:
    - Enables constant-time access for both list and slug endpoints
    - Amortizes cost across subsequent reads (in the hour that the data is cached)
  - If a slug is not in cache, a full refresh is triggered to maintain consistency

- **Future Improvements**
  - Pagination, input validation, and rate limiting
  - Background jobs for refreshes (currently all fetches are on-demand)