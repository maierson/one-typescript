import { ICacheInstance } from './CacheInstance';
import CacheItem from './CacheItem';
import { IFlushArgs } from './interfaces';
import CacheMap from './CacheMap';
export declare const buildFlushMap: (flushArgs: IFlushArgs) => void;
export declare const getItemFlushOrCached: (uid: string, flushArgs: IFlushArgs) => CacheItem;
export declare const ensureItem: (flushArgs: IFlushArgs) => CacheItem;
export declare const preFlush: (flushArgs: IFlushArgs) => void;
export declare const flush: (temp: CacheMap<CacheItem>, instance: ICacheInstance) => void;
