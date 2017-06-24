import { ICacheInstance } from './CacheInstance';
import { ICacheNode } from './CacheNode';
import { ICacheStats } from './interfaces';
export declare const getCallStats: (success: boolean, instance: ICacheInstance) => ICacheStats;
export declare const node: (instance: ICacheInstance, nodeId?: any) => number | ICacheStats;
export declare function getCurrentNode(instance: ICacheInstance): ICacheNode;
export declare function getRepoNode(cacheNodeId: any, instance: ICacheInstance): ICacheNode;
