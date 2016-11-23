import { ICacheRepo } from './CacheRepo';
import CacheRepo from './CacheRepo';
import CacheThread from './CacheThread';
import { ICacheThread } from './CacheThread';

/**
 * Defines each instance of the cache.
 */
export interface ICacheInstance {

    /**
     * Name of the instance in order to locate it in the instance pool.
     */
    name: string,

    /**
     * Store all nodes in a centralized repository to access them by key.
     * The key needs to be unique only amongst nodes.
     * It's a simple incrementor starting at 0
     */
    repo: ICacheRepo,

    thread: ICacheThread,

    /** Increment this key every time a new node is assigned. */
    nextNodeKey: number,

    reset: () => void
}

export default class CacheInstance implements ICacheInstance {
    name: string;
    repo: ICacheRepo = new CacheRepo();
    thread: ICacheThread = new CacheThread();
    nextNodeKey: number = 0;
    reset = () => {
        this.repo = new CacheRepo();
        this.thread = new CacheThread();
        this.nextNodeKey = 0;
    }
    constructor(name: string) {
        this.name = name;
    }
}