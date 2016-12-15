import { ICacheRepo } from './CacheRepo';
import { ICacheThread } from './CacheThread';
import { ICacheNode } from './CacheNode';
export interface ICacheInstance {
    name: string;
    repo: ICacheRepo;
    thread: ICacheThread;
    nextNodeKey: number;
    reset: () => void;
    addNode: (node: ICacheNode) => boolean;
    size: () => number;
    length: () => number;
}
export default class CacheInstance implements ICacheInstance {
    name: string;
    repo: ICacheRepo;
    thread: ICacheThread;
    nextNodeKey: number;
    constructor(name: string);
    reset: () => void;
    addNode: (node: ICacheNode) => boolean;
    length: () => number;
    size: () => number;
}
