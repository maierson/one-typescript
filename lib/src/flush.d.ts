import { IFlushArgs } from './interfaces';
import { ICacheInstance } from './CacheInstance';
import CacheMap from './CacheMap';
import CacheItem from './CacheItem';
export declare const preFlush: (flushArgs: IFlushArgs, instance: ICacheInstance) => void;
export declare const flush: (temp: CacheMap<CacheItem>, instance: ICacheInstance) => void;
