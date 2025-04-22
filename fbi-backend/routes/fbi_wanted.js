import { fetchWantedFBI } from '../services/fbi_service.js';
import { fetchFromCache, saveInCache } from '../cache/memory.js';
import express from 'express';

export function fbiWantedRoutes() {
    const router = express.Router();
    router.get('/', async (req, res) => {
        try {
            const queryParams = req.query;
            const key = 'FBI_CACHE_' + JSON.stringify(queryParams);
            const cachedData = fetchFromCache(key);
            if (cachedData) {
                return res.json(cachedData);
            }

            let filter = { ...queryParams } 
            delete filter.query
            if (queryParams.query) {
                filter = {
                     ...filter,
                    title: queryParams.query,
                    description: queryParams.query,
                    subject: queryParams.query,
                 }
            }

            const data = await fetchWantedFBI(filter);
            saveInCache(key, data);
            res.json(data);

        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Failed to fetch data from FBI API' });
        }
    });

    return router;
}
