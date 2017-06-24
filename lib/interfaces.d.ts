import CacheItem from './CacheItem';
import CacheMap from './CacheMap';
import { ICacheInstance } from './CacheInstance';
export interface IFlushArgs {
    flushMap: CacheMap<CacheItem>;
    evictMap?: CacheMap<CacheItem>;
    instance: ICacheInstance;
}
export interface ICacheStats {
    success: boolean;
    nodeId: number;
    length: number;
    name: string;
}
