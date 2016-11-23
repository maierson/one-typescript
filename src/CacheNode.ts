import CacheMap from './CacheMap';
import CacheItem from './CacheItem';

/**
 * A single node in the cache holding all items that have been
 * added to the cache in one single atomic operation.
 */
export interface ICacheNode {
    id: number,
    items: CacheMap<CacheItem>
}

export class CacheNode implements ICacheNode {
    id: number;
    items: CacheMap<CacheItem> = new CacheMap<CacheItem>();
    constructor(nodeId: number) {
        this.id = nodeId;
    }
}