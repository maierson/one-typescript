import CacheMap from './CacheMap';
import CacheItem from './CacheItem';
import { ICacheInstance } from './CacheInstance';

/**
 * Arguments object used for flushing changes to a specific cache instance.
 */
export interface IFlushArgs {

    /** the entity(s) being manipulated for caching */
    entity?: {} | Array<{}>,

    /* optional for evicts */
    entityUid?: string,

    /** atomic operation map for flushing all changes at once */
    flushMap: CacheMap<CacheItem>,

    /** map of potential evicts in case of de-referencing */
    evictMap?: CacheMap<CacheItem>,

    /** id of item's direct parent */
    parentUid?: string,

    /** path to the reference being changed inside an entity */
    refPath?: string,

    /** instance of the cache currently being modified */
    instance: ICacheInstance
}

export interface ICacheStats {
    /* whether the operation was successful or faild*/
    success: boolean,

    /* id of the node that the current operation created if successful */
    node: number,

    /* total number of nodes on the cache */
    length: number,

    /* name of the cache instance - defaults to 'one' */
    name: string,
}