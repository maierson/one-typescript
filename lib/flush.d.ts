import CacheItem from './CacheItem';
import CacheMap from './CacheMap';
import { ICacheInstance } from './CacheInstance';
import { IFlushArgs } from './interfaces';
export declare const flush: (temp: CacheMap<CacheItem>, instance: ICacheInstance) => void;
export declare const preFlush: (flushArgs: IFlushArgs, instance: ICacheInstance) => void;
