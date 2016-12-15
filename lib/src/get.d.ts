import { ICacheInstance } from './CacheInstance';
import CacheItem from './CacheItem';
import CacheMap from './CacheMap';
import { IFlushArgs } from './interfaces';
export declare const getItem: (entity: string | number | any[] | {}, instance: ICacheInstance, nodeId?: number) => {};
export declare const getEditItem: (obj: string | number | any[] | {}, instance: ICacheInstance, nodeId?: number) => any;
export declare const isOnCache: (flushArgs: IFlushArgs) => boolean;
export declare const getCachedItem: (uid: string, instance: ICacheInstance) => CacheItem;
export declare const getCacheCurrentStack: (instance: ICacheInstance) => CacheMap<CacheItem>;
