import { ICacheInstance } from './CacheInstance';
import CacheItem from './CacheItem';
import CacheMap from './CacheMap';
import { clearNext } from './evict';
import { preFlush, buildFlushMap, updatePointers } from './flush';
import { ICacheStats, IFlushArgs } from './interfaces';
import { getCallStats } from './locate';
import { isArray, isObject } from './util';

/**
 * Puts an item on the cache and updates all its references to match any present in the item's entity tree
 * @param {Object|Object[]} entityOrArray object to be put into the context
 * @returns {*} historyState object containing specific information about the cache node that has been created
 *  to store the items that were put.
 */
export const putItem = (entity: {} | Array<{}>, instance: ICacheInstance) => {
    // TODO ****** freeze arrays on put
    // only mergeThread entities with uid
    if ((isArray(entity) || isObject(entity))) {

        const evictMap: CacheMap<CacheItem> = new CacheMap<CacheItem>();
        const flushMap: CacheMap<CacheItem> = new CacheMap<CacheItem>();
        flushMap['__UPDATED__'] = false;

        let flushArgs: IFlushArgs = {
            entity: entity,
            flushMap: flushMap,
            evictMap: evictMap,
            parentUid: null,
            refPath: "",
            instance: instance
        }

        buildFlushMap(flushArgs);
        updatePointers(flushArgs);

        if (flushArgs.flushMap.size() > 0 && flushMap['__UPDATED__'] === true) {
            return commitPut(flushArgs);
        }
    }
    return getCallStats(false, instance);
}

const commitPut = (flushArgs: IFlushArgs): ICacheStats => {
    // remove from the nodes all states coming after the current state (clears history after now)
    clearNext(flushArgs.instance);
    preFlush(flushArgs);
    return getCallStats(true, flushArgs.instance);
}

