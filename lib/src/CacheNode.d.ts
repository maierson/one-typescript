import CacheItem from './CacheItem';
import CacheMap from './CacheMap';
export interface ICacheNode {
    id: number;
    items: CacheMap<CacheItem>;
}
export declare class CacheNode implements ICacheNode {
    id: number;
    items: CacheMap<CacheItem>;
    constructor(nodeId: number);
}
