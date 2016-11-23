import { getItemFlushOrCached } from './flush';
import { IFlushArgs } from './interfaces';
import CacheItem from './CacheItem';
import { config } from './cache';
import * as opath from './path';

export const assignRefToParent = (refItem, flushArgs: IFlushArgs) => {
    if (flushArgs.parentUid) {
        let parentItem = getItemFlushOrCached(flushArgs.parentUid, flushArgs);
        if (parentItem && flushArgs.refPath) {
            assignRefs(parentItem, refItem, flushArgs.refPath);
        }
    }
};

/**
  * Records the dependencies of a uid entity (in refItem) to its containing uid entity (in parentItem).
  * @param parentItem cache item of the entity containing the reference
  * @param refItem cache item of the reference entity
  * @param refPath the concatenated path of the ref entity inside the parent entity
  */
const assignRefs = (parentItem: CacheItem, refItem: CacheItem, refPath: string) => {
    let parentUid = parentItem.entity[config.uidName];
    let refUid = refItem.entity[config.uidName];

    // add parent reference to child
    addRefTo(parentItem, refUid, refPath);
    addRefFrom(refItem, parentUid, refPath);
};

/**
  * Adds ref_to metadata to a parent item that contains a referenced uid entity.
  *
  * @param {{}} parentItem the item of the parent entity
  * @param {string} refUid the uid of the referenced entity
  * @param {string} path the path inside the parent entity where the referenced entity is located
  * @returns {{}} the parentItem just in case it was cloned for purity
  */
const addRefTo = (parentItem, refUid, path) => {
    let refTo = parentItem.ref_to;
    if (!parentItem.ref_to[refUid]) {
        parentItem.ref_to[refUid] = [];
        parentItem.ref_to.length += 1;
    }
    let refArray = refTo[refUid];
    if (refArray.indexOf(path) < 0) {
        refArray.push(path);
    }
    return parentItem;
};

/**
 * Adds ref_from metadata to a referenced item that is contained in the parent entity.
 *
 * @param {{}} refItem the item of the referenced entity
 * @param {string} parentUid the uid of the parent entity
 * @param {string} path the path inside the parent entity where the referenced entity is located
 */
const addRefFrom = (refItem, parentUid, path) => {
    let refFrom = refItem.ref_from;
    if (!refItem.ref_from[parentUid]) {
        refItem.ref_from[parentUid] = [];
        refItem.ref_from.length += 1;
    }
    let fromArray = refFrom[parentUid];
    if (fromArray.indexOf(path) < 0) {
        fromArray.push(path);
    }
    return refItem;
};

/**
  * Checks the refTo metadata to ensure that all referenced items are still in this entity.
  *
  * @param entityUid the entity to be checked for refTo integrity
  * @param flushMap
  * @param evictMap map of potentially deletable items in case all references have been removed
  */
export const updateRefTos = (entityUid, flushArgs: IFlushArgs) => {
    let item = getItemFlushOrCached(entityUid, flushArgs);
    if (item) {
        let refTo = item.ref_to;
        // check the references for each referenced item. References are keyed by refToUid in the refTo object.
        // Each refToUid value is an array containing a list of paths where the reference is located inside this
        // entity
        for (let refToUid in refTo) {
            if (refTo.hasOwnProperty(refToUid)) {
                // get the list of paths
                let paths = refTo[refToUid];
                // update the paths array to contain only the remaining references
                let updatedPaths = paths.map(path => {
                    let reference = opath.get(item.entity, path);
                    if (reference) {
                        let targetUid = reference[config.uidName];
                        if (targetUid) {
                            // *** keep double equality here to convert strings to numbers
                            let found = targetUid == refToUid;
                            if (found === true) {
                                return path;
                            }
                        }
                    }
                    removeRefFrom_Value(entityUid, refToUid, flushArgs);
                }).filter(item => {
                    return item !== null && item !== undefined;
                });

                // update or remove the paths
                if (updatedPaths.length > 0) {
                    item.ref_to[refToUid] = updatedPaths;
                } else {
                    item.ref_to[refToUid] = undefined;
                    delete item.ref_to[refToUid];
                }
            }
        }
    }
};

/**
  * Removes a path value from an item's ref_from metadata. It places it either on the flush map if it was updated or
  * the evict map if there are no references left over.
  *
  * @param parentUid uid of the entity holding the reference that might have been changed
  * @param refUid uid of the entity being referenced
  * @param path path in the parent entity where the referenced entity is located
  * @param flushMap map of updated items to be persisted into the cache
  * @param evictMap map of updated items to be removed from the cache
  */
const removeRefFrom_Value = (parentUid, refUid, flushArgs: IFlushArgs) => {
    // get the item of the referenced entity
    let refItem: CacheItem = getItemFlushOrCached(refUid, flushArgs);
    if (refItem) {
        // make a new instance (pure function)
        refItem = refItem.clone();// objectAssign({}, refItem);

        //cloneRef(refItem, REF_FROM);
        // remove the path from the refFrom
        if (refItem.ref_from.hasOwnProperty(parentUid)) {
            // get the array of refs
            removeRefFrom(refItem, parentUid, flushArgs.refPath);
            if (refItem.ref_from.size() === 0) {
                flushArgs.evictMap.set(refUid, refItem);
                // just in case
                flushArgs.flushMap.delete(refUid);
            } else {
                flushArgs.flushMap.set(refUid, refItem);
                // just in case
                flushArgs.evictMap.delete(refUid);
            }
        }
    }
};

const removeRefFrom = (item, parentUid, path) => {
    let refsArray = item.ref_from[parentUid];

    let index = refsArray.indexOf(path);

    // make an editable copy
    refsArray = refsArray.slice();
    refsArray.splice(index, 1);
    item.ref_from[parentUid] = refsArray;
    if (refsArray.length == 0) {
        item.ref_from[parentUid] = undefined;
        delete item.ref_from[parentUid];
        item.ref_from.length -= 1;
    }
};