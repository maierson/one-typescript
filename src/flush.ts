import { ICacheInstance } from './CacheInstance';
import { getCachedItem, isOnCache, getCacheCurrentStack } from './get';
import * as opath from './path';
import { config } from './cache';
import { cacheLength, deepClone, getNewCacheNode, hasUid, isArray, isNumber, isObject, isDate } from './util';
import { concatProp } from './path';
import { getCurrentNode } from './locate';
import CacheItem from './CacheItem';
import { IFlushArgs } from './interfaces';
import CacheMap from './CacheMap';
import { assignRefToParent, updateRefTos } from './ref';
declare let require: any;
const objectAssign = require('object-assign');

/**
 * Analyzes an entity deeply and adds all its cacheable references to the flushMap
 * so that they can be all flushed together in a single atomic operation.
 * This results in a single cache node being added for all the cached entities.
 *
 * @param flushArgs - config object containing all the respective arguments
 *  required to perform this call.
 */
export const buildFlushMap = (flushArgs: IFlushArgs) => {
    console.log("\n\n\n\n\n")
    console.log("BUILD FLUSH MAP",
        "\n  entity", flushArgs.entity,
        "\n  parentUid:", flushArgs.parentUid)
    console.log("=====================================")

    if (hasUid(flushArgs.entity)) {
        cacheUidEntityRefs(flushArgs);
    } else {
        if (isArray(flushArgs.entity)) {
            cacheArrRefs(flushArgs);
        } else {
            cacheEntityRefs(flushArgs);
        }
        //Object.freeze(flushArgs.entity);
    }
};

const cacheUidEntityRefs = (flushArgs: IFlushArgs) => {
    if (isDirty(flushArgs) === true) {
        console.log("CACHE UID ENTITY REFS",
            "\n  entity:", flushArgs.entity)

        ensureOnFlushMap(flushArgs);
        cacheEntityRefs(flushArgs);

        // done with building this entity 
        // check its reference paths to make sure nothing is stale
        let entityUid = String(flushArgs.entity[config.uidName]);

        updateRefTos(entityUid, flushArgs);
    }
}

/**
 * Creates a CacheItem for an entity the first time it is accessed
 * and puts it on the flushMap.
 */
const ensureOnFlushMap = (flushArgs: IFlushArgs) => {
    let entityUid = String(flushArgs.entity[config.uidName]);
    if (flushArgs.flushMap.has(entityUid) === false) {
        let entity = flushArgs.entity;
        ensureItem(flushArgs);

        // reset the parent uid to the object being iterated down
        flushArgs.parentUid = String(entityUid);
    }
}

/**
 * Caches the refs that might be contained in a javascript object
 * that optionally has a uid property. Loops through each property
 * to find the appropriate ones.
 *
 * @param parentEntity
 * @param flushMap
 * @param parentUid
 * @param evictMap
 * @param refPath the path of the referenced uid entity inside its parent
 */
const cacheEntityRefs = (flushArgs: IFlushArgs) => {
    console.log("CACHE ENTITY REFS",
        "\n  entity: ", flushArgs.entity)

    let parentEntity = flushArgs.entity;

    for (let prop in parentEntity) {
        console.log("PROP", prop)
        if (parentEntity.hasOwnProperty(prop)) {

            let refEntity = parentEntity[prop];

            if (isObject(refEntity) || isArray(refEntity)) {
                flushArgs.entity = refEntity;
                if (parentEntity[config.uidName]) {
                    flushArgs.parentUid = parentEntity[config.uidName];
                }
                if (flushArgs.parentUid) {
                    flushArgs.refPath = concatProp(flushArgs.refPath, prop);
                }
                if (!flushArgs.refPath) {
                    flushArgs.refPath = prop;
                }
            }

            console.log("CACHE ENTITY REFS",
                "\n  entity:", refEntity, flushArgs.entity,
                "\n  parentUid:", flushArgs.parentUid,
                "\n  refPath:", flushArgs.refPath)

            if (isArray(refEntity)) {
                cacheArrRefs(flushArgs);
            } else if (isObject(refEntity)) {
                // must do this even if item exists not dirty for refernce counting
                cacheObjRefs(flushArgs);
            }
            //     Object.freeze(refEntity);
        }
    }
};

/**
     * Caches the refs that might be contained in an array.
     *
     * @param entity
     * @param flushMap
     * @param parentUid
     * @param evictMap
     * @param refPath
     */
const cacheArrRefs = (flushArgs: IFlushArgs) => {
    let entity = flushArgs.entity;

    let arrayPath = flushArgs.refPath;
    (entity as Array<any>).forEach((next, index) => {

        // always have as parent the closest uid entity        
        if (entity[config.uidName]) {
            flushArgs.parentUid = entity[config.uidName];
        }
        flushArgs.entity = next;

        if (flushArgs.refPath) {
            flushArgs.refPath = arrayPath + "." + index;
        }

        console.log("CACHE ARR REFS",
            "\n  entity:", entity,
            "\n  refPath:", flushArgs.refPath,
            "\n  parentUid:", flushArgs.parentUid,
            "\n  next:", next,
            "\n  isArray:", isArray(next),
            "\n  isObject:", isObject(next))

        if (isArray(next)) {
            cacheArrRefs(flushArgs);
        } else if (isObject(next)) {
            cacheObjRefs(flushArgs);
        }
    });
    Object.freeze(entity);
};

/**
    * Caches the refs that might be contained in a single javascript object.
    *
    * @param refEntity
    * @param flushMap
    * @param parentUid
    * @param evictMap
    * @param refPath
    */
const cacheObjRefs = (flushArgs: IFlushArgs) => {
    let refEntity = flushArgs.entity;

    console.log("CACHE OBJ REFS",
        "\n  entity:", flushArgs.entity,
        "\n  parentUid:", flushArgs.parentUid,
        "\n  refPath:", flushArgs.refPath)


    if (hasUid(flushArgs.entity)) {
        cacheUidObjRefs(flushArgs);
    } else {
        // go deeper down the non uid rabbit hole - keep building the refPath
        cacheEntityRefs(flushArgs);
    }
};

const cacheUidObjRefs = (flushArgs: IFlushArgs) => {

    // if the refEntity has an uid it means that we're at the end of the refPath 
    // and must assign all ref info into the entity's item
    let refItem = ensureItem(flushArgs);
    assignRefToParent(refItem, flushArgs);

    let exists = isOnCache(flushArgs);

    if (exists === true) {
        // not iterating inside it as it's the same as cached
        return;
    }
    //flushArgs.parentUid = String(flushArgs.entity[config.uidName]);

    console.log("CACHE UID OBJ REFS",
        "\n  entity:", flushArgs.entity,
        "\n  parentUid:", flushArgs.parentUid,
        "\n  refPath:", flushArgs.refPath)

    // flushArgs.refPath = "";
    buildFlushMap(flushArgs);
}

const isDirty = (flushArgs: IFlushArgs): boolean => {
    let cachedItem = getCachedItem(flushArgs.entity[config.uidName], flushArgs.instance);
    return !cachedItem || cachedItem.entity !== flushArgs.entity;
}

/**
 *
 * @param flushMap
 */
export const updatePointers = (flushArgs: IFlushArgs) => {
    // at this point all items are added into the flush map - update their pointers if applicable
    flushArgs.flushMap.forEach((key, item: CacheItem) => {

        // do not modify flush map on its own iteration but ok to pass along for reference
        let refsFrom = item.ref_from;

        // parentUid = uid of the item being targeted for ref update (ie the ref's parent)
        for (let parentUid in refsFrom) {
            if (refsFrom.hasOwnProperty(parentUid)) {

                let paths = refsFrom[parentUid];
                let parentItem = flushArgs.flushMap.get(parentUid);
                if (!parentItem) {
                    parentItem = getCachedItem(parentUid, flushArgs.instance);
                }

                /* only update if dirty - no need to iterate all paths - just check the first one
                 - if dirty then the parent entity needs to be cloned and updated anyways so pass in
                 the ref entity when cloning - it will be updated wherever it is encountered during cloning */
                if (parentItem && paths.length > 0) {
                    let firstPath = paths[0];
                    let targetRef = opath.get(parentItem.entity, firstPath);
                    // check for dirty
                    let dirty = (targetRef && targetRef !== item.entity);

                    if (dirty === true) {
                        let args: IFlushArgs = {
                            entity: parentItem.entity,
                            flushMap: flushArgs.flushMap,
                            instance: flushArgs.instance
                        }
                        parentItem = ensureItem(args);

                        // TODO figure out a way to not clone the entity every time particularly if it is
                        // already present on the flush map

                        // the entity is still frozen here - clone it to update and freeze it deeply
                        parentItem.entity = deepClone(parentItem.entity, item.entity, true);
                    }
                }
            }
        }
    });
};



/**
 * Gets the item either from the flush map or the currently active node.
 */
export const getItemFlushOrCached = (uid: string, flushArgs: IFlushArgs) => {
    if (!uid) {
        return;
    }
    uid = String(uid);
    let item = flushArgs.flushMap.get(uid);
    if (!item) {
        item = getCachedItem(uid, flushArgs.instance);
    }
    if (item && Object.isFrozen(item)) {
        item = item.clone();
    }
    return item;
};

/**
    * Guarantees that the entity's item is present on the flush map and returns it.
    *
    * @param entity
    * @param flushMap
    * @returns {*} an editable item corresponding to the entity on the flush map.
    */
export const ensureItem = (flushArgs: IFlushArgs): CacheItem => {
    let itemUid = String(flushArgs.entity[config.uidName]);
    let item: CacheItem = flushArgs.flushMap.get(itemUid);
    if (item) {
        return item;
    }

    // else make a copy of the live item
    let live: CacheItem = getCachedItem(itemUid, flushArgs.instance);
    item = new CacheItem(flushArgs.entity, live);

    flushArgs.flushMap.set(itemUid, item);
    flushArgs.flushMap['__UPDATED__'] = true;
    return item;
};

/**
 * For items that are unique in context all references on the map must point to the same single object. In order to
 * prevent the map from replicating itself on each set operation this must be executed with mutations thus
 * adding all items on the same mutating instance of the map. All items to be added must have been previously
 * collected in the array.
 * @param flushArray array of items to be put into the cache
 * @param evictMap map of items that were de-referenced and should be removed from the next cache node
 */
export const preFlush = (flushArgs: IFlushArgs) => {
    // get a copy of the current nodes
    let temp = new CacheMap<CacheItem>();

    //[...flushMap.values()], evictMap/

    let currentStack: CacheMap<CacheItem> = getCacheCurrentStack(flushArgs.instance);
    if (currentStack) {
        currentStack.forEach((key, item: CacheItem) => {
            temp.set(key, item);
        });
    }

    flushArgs.flushMap.forEach((key, item: CacheItem) => {
        // track the uid of the item being changed and referencing the items.
        let itemUid = item.entity[config.uidName];
        freezeItem(item);
        temp.set(String(itemUid), item);
    });

    if (flushArgs.evictMap.size() > 0) {
        flushArgs.evictMap.forEach((key, value) => {
            temp.delete(String(key));
        });
    }

    flush(temp, flushArgs.instance);
};

const freezeItem = (item: CacheItem) => {
    Object.freeze(item);
    Object.freeze(item.entity);
    Object.freeze(item.ref_to);
    Object.freeze(item.ref_from);
};

/**
   * The cache might have a series of intermediary steps that do not need to be persisted to the nodes. Flush
   * pushes the current state into the nodes once all atomic changes for a single merge have happened.
   *
   * @param temp
   * @param threadIds
   */
export const flush = (temp: CacheMap<CacheItem>, instance: ICacheInstance) => {
    if (temp !== null) {
        Object.freeze(temp);
        let cacheNode = getNewCacheNode(instance);
        cacheNode.items = temp;

        if (instance.thread.nodes.indexOf(cacheNode.id) < 0) {
            instance.thread.nodes.push(cacheNode.id);
            instance.thread.current += 1;
        }
    }
};



