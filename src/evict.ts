import { ICacheInstance } from './CacheInstance';
import { cacheSize, hasUid, isArray, isObject } from './util';
import { config } from './cache';
import { getCacheCurrentStack, getCachedItem, getEditItem } from './get';
import CacheMap from './CacheMap';
import CacheItem from './CacheItem';
import * as opath from './path';
import { getItemFlushOrCached, buildFlushMap, flush } from './flush';
import { IFlushArgs } from './interfaces';
import { getCallStats } from './locate';
import { updatePointers, updateRefFroms } from './ref';
declare let require: any;

/**
 *
 * @param {Object|string|Object[]|string[]}obj Either a single entity or its uid or an array of
 *     entities or an array of uids (cannot mix entities with uids)
 * @return boolean true if the state was modified, false otherwise
 */
export const evictItem = (obj, instance: ICacheInstance) => {

    let uidArray = buildEvictUidArray(obj);

    if (uidArray.length == 0) {
        return getCallStats(false, instance);
    }
    let currentState = getCacheCurrentStack(instance);
    let found = uidArray.some(item => {
        return currentState && currentState.has(String(item));
    });

    if (!found) {
        return getCallStats(false, instance);
    }

    let tempState = new CacheMap<CacheItem>();
    currentState.forEach((key, value: CacheItem) => {
        tempState.set(key, value);
    });


    // TODO force the thread current to the end first instead

    // remove subsequent states - altering the nodes
    // clearNext(instance);

    let flushMap = new CacheMap<CacheItem>();
    let evictMap = new CacheMap<CacheItem>();

    let flushArgs: IFlushArgs = {
        flushMap: flushMap,
        evictMap: evictMap,
        instance: instance
    }

    let parentsChanged = [];

    console.log(uidArray)

    uidArray.forEach(uid => {
        flushArgs.entityUid = uid;

        // remove REF_FROM in item references metadata
        clearTargetRefFroms(flushArgs);

        // value doesn't matter here - will be evicted
        evictMap.set(uid, null);

        // remove REF_TO in parent metadata
        clearParentRefTos(uidArray, parentsChanged, flushArgs);
    });

    putParentsChanged(parentsChanged, flushMap, evictMap, instance);

    console.log(parentsChanged);

    // updates
    flushMap.forEach((key, item: CacheItem) => {
        tempState.set(key, item);
    });

    // evicts
    evictMap.forEach((key, item: CacheItem) => {
        tempState.delete(key);
    });

    flush(tempState, instance);

    return getCallStats(true, instance);
};

const putParentsChanged = (parentsChanged: Array<any>, flushMap: CacheMap<CacheItem>, evictMap: CacheMap<CacheItem>, instance: ICacheInstance) => {
    if (parentsChanged && parentsChanged.length > 0 && cacheSize(instance) > 0) {
        let flushArgs: IFlushArgs = {
            flushMap: flushMap,
            evictMap: evictMap,
            instance: instance
        }
        buildFlushMap(flushArgs);
        // refTos have been updated already only handle refFroms
        flushArgs.flushMap.forEach((key, item: CacheItem) => {
            // do not modify flush map on its own iteration 
            // but ok to pass along for reference
            updateRefFroms(item, flushArgs);
        })
    }
};

/**
   * Removes this entity's references from all of its reference item's metadata.
   *
   * @param entityUid
   * @param flushMap
   * @param evictMap
   */
const clearTargetRefFroms = (flushArgs: IFlushArgs) => {
    let item: CacheItem = getCachedItem(flushArgs.entityUid, flushArgs.instance);
    if (item) {
        item.mapTo.forEach((toUid, paths) => {
            let refItem: CacheItem = getItemFlushOrCached(toUid, flushArgs);
            if (refItem) {
                clearRefFrom(refItem, flushArgs.entityUid);
                if (refItem.mapFrom.size() === 0) {
                    flushArgs.entityUid = toUid;
                    clearTargetRefFroms(flushArgs);
                    flushArgs.evictMap.set(toUid, refItem);
                } else {
                    flushArgs.flushMap.set(toUid, refItem);
                }
            }
        })
    }
};

/**
   * Clears all references from a specific parent when it is being evicted.
   *
   * @param refItem
   * @param parentUid
   */
const clearRefFrom = (refItem: CacheItem, parentUid) => {
    let refsArray = refItem.mapFrom.get(parentUid);
    if (!refsArray) {
        return;
    }
    refItem.mapFrom = refItem.mapFrom.clone();
    refItem.mapFrom.delete(parentUid);
};

// /**
//  * Clones an item's reference object for pure functionality
//  *
//  * @param item
//  * @param refName
//  */
// const cloneRef = (item: CacheItem, refName) => {
//     let length = item[refName].length;
//     item[refName] = objectAssign(getNewLengthObj(), item[refName]);
//     item[refName].length = length;
// };

/**
 * On evict remove all pointers and references to this entity.
 *
 * @param entityUid
 * @param flushMap
 */
const clearParentRefTos = (uidArray, parentsChanged, flushArgs: IFlushArgs) => {
    let item: CacheItem = getItemFlushOrCached(flushArgs.entityUid, flushArgs);

    if (item) {
        item.mapFrom.forEach((parentUid, paths) => {
            let parentItem = getItemFlushOrCached(parentUid, flushArgs);
            if (parentItem) {
                let success = clearRefTo(parentItem, flushArgs.entityUid, flushArgs.instance);
                if (success === true) {
                    flushArgs.flushMap.set(parentUid, parentItem);
                    if (uidArray.indexOf(parentUid) < 0) {
                        parentsChanged.push(parentItem);
                    }
                }
            }
        })
    }
};

/**
  * Clears all
  *
  * @param parentItem
  * @param refUid
  */
const clearRefTo = (parentItem: CacheItem, refUid, instance: ICacheInstance) => {
    // first remove all instances of entity from the parent
    let parent = parentItem.entity;
    if (Object.isFrozen(parent)) {
        parent = getEditItem(parent[config.uidName], instance);
        parentItem.entity = parent;
    }
    let refPaths = parentItem.mapTo.get(refUid);
    refPaths.forEach(path => {
        opath.del(parent, path);
    });
    if (!Object.isFrozen(parent)) {
        Object.freeze(parent);
    }
    parentItem.entity = parent;

    // then clear the metadata
    parentItem.mapTo = parentItem.mapTo.clone();
    parentItem.mapTo.delete(refUid);
    return true;
};

/**
    *
    * @param obj
    * @returns {*}
    */
const buildEvictUidArray = obj => {
    let uidArray = [];
    if (isArray(obj)) {
        // array - check if we have uids or strings
        obj.forEach(item => {
            if (hasUid(item)) {
                uidArray.push(String(item[config.uidName]));
            } else {
                if (typeof item === "string" || typeof item === "number") {
                    uidArray.push(String(item))
                }
                // else nothing - skip it
            }
        });
    } else {
        let uid = obj;
        if (isObject(obj)) {
            uid = obj[config.uidName];
        }
        if (uid === undefined) {
            return uidArray;
        }
        uidArray.push(String(uid));
    }
    return uidArray;
};



/**
 * Removes the nodes after the current node in order to repurpose history if user undoes and chooses another
 * direction
 *
 * @param threadId
 */
export const clearNext = (instance: ICacheInstance) => {
    // clear all nodes after this one
    let thread = instance.thread;
    if (thread.current < thread.nodes.length - 1) {
        let removedNodes = thread.nodes.slice(thread.current + 1, thread.nodes.length);
        thread.nodes = thread.nodes.slice(0, thread.current + 1);
        thread.current = thread.nodes.length - 1;
        truncateThreads(removedNodes, instance);
    }
};

/**
    *
    * @param removedNodes array of nodes that are being removed from the main thread
    */
const truncateThreads = (removedNodes, instance: ICacheInstance) => {
    removedNodes.forEach(cacheNodeId => {
        let cacheNode = instance.repo.get(cacheNodeId);
        if (cacheNode) {
            instance.repo.delete(cacheNodeId);
        }
    });
};