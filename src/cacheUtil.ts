import CacheItem from './CacheItem';
import { ICacheInstance } from './CacheInstance';
import { config } from './cache';
import { ICacheNode } from './CacheNode';
import { ICacheRepo } from './CacheRepo';
import CacheMap from './CacheMap';
import { IFlushArgs } from './interfaces';

/* the same exact instance exists on the cache's current node */
export const isOnCache = (entity, instance: ICacheInstance): boolean => {
    let cachedItem: CacheItem = getCachedItem(entity[config.uidName], instance);
    return cachedItem && cachedItem.entity === entity;
}

export const isOnFlushMap = (entity, flushMap): boolean => {
    return !!flushMap.get(entity[config.uid]);
}

/**
 * Pulls an item out of the current version of the cache.
 * Gets the actual real instance but frozen (uneditable).
 * Useful for testing.
 * @param uid
 * @returns {*}
 */
export const getCachedItem = (uid: string, instance: ICacheInstance): CacheItem => {
    let currentNode: ICacheNode = getCurrentNode(instance);
    return currentNode ? currentNode.items.get(String(uid)) : undefined;
};

/** Finds an item anywhere it exists either on the cache or on the flushMap */
export const getItemFlushOrCached = (uid: string, flushArgs: IFlushArgs) => {
    if (uid) {
        uid = String(uid);
        let item = flushArgs.flushMap.get(uid);
        if (!item) {
            item = getCachedItem(uid, flushArgs.instance);
        }
        if (item && Object.isFrozen(item)) {
            item = item.clone();
        }
        return item;
    }
};

/**
 * The node currently being displayed by the cache.
 *
 * @param threadId
 * @returns {undefined} the cache node that the thread is currently left pointing at.
 */
function getCurrentNode(instance: ICacheInstance): ICacheNode {
    let currentNodeId: number = instance.thread.nodes[instance.thread.current];
    // watch out currentNodeId evaluates to false when it's 0
    return currentNodeId >= 0 ? getRepoNode(currentNodeId, instance.repo) : undefined;
}

/**
 * Specific node on the repo.
 */
function getRepoNode(nodeId: number, repo: ICacheRepo): ICacheNode {
    return repo.get(nodeId);
}

/**
  *
  * @returns {Map}
  */
export const getCacheCurrentStack = (instance: ICacheInstance): CacheMap<CacheItem> => {
    let currentNode = getCurrentNode(instance);
    return currentNode ? currentNode.items : undefined;
};

/**
 * Creates a CacheItem for an entity the first time it is accessed
 * and puts it on the flushMap.
 */
export const ensureOnFlushMap = (entity, flushArgs: IFlushArgs) => {
    let entityUid = String(entity[config.uidName]);

    if (!flushArgs.flushMap.has(entityUid)) {
        ensureItem(entity, flushArgs);
        // reset the parent uid to the object being iterated down
        //     flushArgs.parentUid = String(entityUid);
    }
}

/**
 * Guarantees that the entity's item is present on the flush map and returns it.
 *
 * @param entity
 * @param flushMap
 * @returns {*} an editable item corresponding to the entity on the flush map.
 */
export const ensureItem = (entity, flushArgs: IFlushArgs): CacheItem => {
    let itemUid = String(entity[config.uidName]);
    let item: CacheItem = flushArgs.flushMap.get(itemUid);
    if (item) {
        return item;
    }

    // else make a copy of the live item
    let live: CacheItem = getCachedItem(itemUid, flushArgs.instance);
    item = new CacheItem(entity, live);

    flushArgs.flushMap.set(itemUid, item);
    flushArgs.flushMap['__UPDATED__'] = true;
    return item;
};

export const freezeItem = (item: CacheItem) => {
    Object.freeze(item);
    Object.freeze(item.entity);
    Object.freeze(item.mapTo);
    Object.freeze(item.mapFrom);
};