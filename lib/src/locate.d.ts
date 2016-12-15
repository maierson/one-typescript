import { ICacheInstance } from './CacheInstance';
import { ICacheStats } from './interfaces';
import { ICacheNode } from './CacheNode';
export declare const getCallStats: (success: boolean, instance: ICacheInstance) => ICacheStats;
export declare const node: (instance: ICacheInstance, nodeId?: any) => number | ICacheStats;
export declare function getCurrentNode(instance: ICacheInstance): ICacheNode;
export declare function getRepoNode(cacheNodeId: any, instance: ICacheInstance): ICacheNode;
