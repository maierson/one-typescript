import { ICacheNode } from './CacheNode';
import CacheMap from './CacheMap';
export interface ICacheRepo {
    get: (nodeId: number) => ICacheNode;
    length: number;
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
