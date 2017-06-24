import { ICacheStats } from './interfaces';
import { ICacheInstance } from './CacheInstance';
export declare const evictItem: (obj: any, instance: ICacheInstance) => ICacheStats;
