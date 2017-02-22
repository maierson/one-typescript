import { ICacheNode } from './CacheNode';
import CacheMap from './CacheMap';
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
