// 
import NodeCache from 'node-cache';

const fbiCache = new NodeCache({
    stdTTL: 600, // 10 minutes.
    maxKeys: 3000 // use max 200MB because the average response size is 60KB
}); 

export function saveInCache(key,data){
    fbiCache.set(key,data)
}

export function fetchFromCache(key){
    fbiCache.get(key)
}
