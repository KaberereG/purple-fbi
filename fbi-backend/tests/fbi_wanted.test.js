import express from 'express';
import request from 'supertest';  
import { fbiWantedRoutes } from '../routes/fbi_wanted.js'; 
import { fetchWantedFBI } from '../services/fbi_service.js';
import { fetchFromCache, saveInCache } from '../cache/memory.js';

jest.mock('../services/fbi_service.js');
jest.mock('../cache/memory.js');

describe('fbiWantedRoutes', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use('/api/wanted', fbiWantedRoutes()); // Using the express app with routes
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks between tests
    });

    test('should return cached data when cache exists', async () => {
        const mockCacheData = { result: 'cached data' };
        const mockQueryParams = { query: 'john doe' };
        const cacheKey = 'FBI_CACHE_' + JSON.stringify(mockQueryParams);

        fetchFromCache.mockReturnValue(mockCacheData); // Simulate cache hit

        const response = await request(app) // Use supertest to make a request
            .get('/api/wanted')
            .query(mockQueryParams);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockCacheData);
        expect(fetchFromCache).toHaveBeenCalledWith(cacheKey); // Ensure cache was checked
        expect(fetchWantedFBI).not.toHaveBeenCalled(); // No API call should be made
    });

    test('should fetch and cache data when cache does not exist', async () => {
        const mockQueryParams = { query: 'john doe' };
        const mockData = { result: 'fetched data' };
        const cacheKey = 'FBI_CACHE_' + JSON.stringify(mockQueryParams);

        fetchFromCache.mockReturnValue(null); // Simulate cache miss
        fetchWantedFBI.mockResolvedValue(mockData); // Mock API fetch response
        saveInCache.mockImplementation(() => {}); // Mock cache save

        const response = await request(app) // Use supertest to make a request
            .get('/api/wanted')
            .query(mockQueryParams);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockData);
        expect(fetchWantedFBI).toHaveBeenCalledWith({
            title: 'john doe',
            description: 'john doe',
            subject: 'john doe',
        }); // Check if correct API call was made
        expect(saveInCache).toHaveBeenCalledWith(cacheKey, mockData); // Ensure data is saved to cache
    });

    test('should handle errors gracefully', async () => {
        const mockQueryParams = { query: 'john doe' };
        const errorMessage = 'Some error occurred';

        fetchFromCache.mockReturnValue(null); // Simulate cache miss
        fetchWantedFBI.mockRejectedValue(new Error(errorMessage)); // Mock error during API call

        const response = await request(app) // Use supertest to make a request
            .get('/api/wanted')
            .query(mockQueryParams);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Failed to fetch data from FBI API' });
    });
});
