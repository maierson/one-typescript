import { ICacheInstance } from './CacheInstance';
import { ICacheStats } from './interfaces';
export declare const evictItem: (obj: any, instance: ICacheInstance) => ICacheStats;
export declare const clearNext: (instance: ICacheInstance) => void;
