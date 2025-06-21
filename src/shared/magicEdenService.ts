import axios from 'axios';

export async function fetchAllCollectionStats(): Promise<any[]> {
    try {
        const response = await axios.get('https://api-mainnet.magiceden.dev/collection_stats/search/bitcoin', {
            params: {
                window: '1d',
                sort: 'volume',
                direction: 'desc',
                offset: 0,
                limit: 1000
            }
        });
        // console.log('Response:', response);
        return response.data;
    } catch (error: any) {
        // console.error('Magic Eden Error:', error);
        
        // Extract and format relevant error details
        const status = error.response?.status || 500;
        const url = error.config?.url;
        const params = error.config?.params;
        const message = JSON.parse(error.response?.data?.message)
        
        // Throw error object for upstream handling
        throw {
            source: 'Magic Eden API',
            status: status,
            message: message,
            details: { url, params }
        };
    }
}