import CacheMap from './CacheMap';
import CacheItem from './CacheItem';
import { ICacheInstance } from './CacheInstance';
export interface IFlushArgs {
    entity?: {} | Array<{}>;
    entityUid?: string;
    flushMap: CacheMap<CacheItem>;
    evictMap?: CacheMap<CacheItem>;
    parentUid?: string;
    refPath?: string;
    instance: ICacheInstance;
}
export interface ICacheStats {
    success: boolean;
    nodeId: number;
    length: number;
    name: string;
}
