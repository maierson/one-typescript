import CacheMap from './CacheMap';
import { ICacheNode } from './CacheNode';
export interface ICacheRepo {
    length: number;
    get: (nodeId: number) => ICacheNode;
    add: (node: ICacheNode) => boolean;
    delete: (nodeId: number) => void;
}
export default class CacheRepo implements ICacheRepo {
    items: CacheMap<ICacheNode>;
    length: number;
    get: (nodeId: any) => ICacheNode;
    add: (node: ICacheNode) => boolean;
    delete: (nodeId: number) => void;
}
