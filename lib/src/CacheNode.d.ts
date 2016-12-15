import CacheMap from './CacheMap';
import CacheItem from './CacheItem';
export interface ICacheNode {
    id: number;
    items: CacheMap<CacheItem>;
}
export declare class CacheNode implements ICacheNode {
    id: number;
    items: CacheMap<CacheItem>;
    constructor(nodeId: number);
}
