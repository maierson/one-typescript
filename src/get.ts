import { config } from './cache';
import { ICacheInstance } from './CacheInstance';
import { ICacheNode } from './CacheNode';
import { ICacheRepo } from './CacheRepo';
import { isArray, isObject, hasUid, deepClone } from './util';
import CacheItem from './CacheItem';
import CacheMap from './CacheMap';
import { IFlushArgs } from './interfaces';
import { getCachedItem } from './cacheUtil';

/**
 * Gets a frozen item out of the cache if existing. This item is for display purposes only (not editable) and is
 * the actual object stored in the cache (not a clone). This is so that we can perform an actual fast identity op
 * when checking for isDirty()
 *
 * @param uidOrEntityOrArray the item(s) to be retrieved
 * @param instance the instance to operate on
 * @param nodeId optional node to get the items from (ie time travel)
 */
export const getItem = (entity: string | number | {} | Array<any>, instance: ICacheInstance, nodeId?: number) => {
    if (!entity) {
        throw new TypeError("One get(): requires a uid to retrieve an item from the cache.");
    }
    if (isArray(entity)) {
        return (entity as Array<any>).map(item => {
            return getObject(item, instance);
        }).filter(item => {
            return item !== null && item !== undefined;
        })
    }
    return getObject(entity, instance);
};

/**
  *
  * @param uidOrEntity
  * @param {string} threadId
  * @returns {*}
  */
const getObject = (uidOrEntity: string | number | {}, instance: ICacheInstance) => {
    let realUid = getActualUid(uidOrEntity);
    if (!realUid) {
        return;
    }
    let item: CacheItem = getCachedItem(realUid, instance);
    return item ? item.entity : undefined;
};

/**
 * Editable clone of the item requested.
 */
export const getEditItem = (obj: string | number | {} | Array<any>, instance: ICacheInstance, nodeId?: number) => {
    console.log("GET EDIT ITEM")
    if (isArray(obj)) {
        return (obj as Array<any>).map(item => {
            return getEditableObject(item, instance);
        }).filter(item => {
            return item !== null && item !== undefined;
        })
    }
    return getEditableObject(obj, instance);
}

/**
 * Gets a shallow copy of the object maintaining all the deep uid references intact (keep identity) so that ui
 * children do not get refreshed needlessly when changing a property on the parent. Note that the children will
 * be frozen so if needing to change a child must get it as editable separately.
 * @param uidOrEntity
 * @returns {*}
 */
const getEditableObject = (uidOrEntity, instance: ICacheInstance) => {
    let realUid = getActualUid(uidOrEntity);
    let existing = getItem(realUid, instance);
    return existing ? deepClone(existing, undefined, false) : undefined;
};

/**
  * Extracts the uid from a parameter that can be either the uid directly or an entity with a uid prop,
  * @param uidOrEntity
  * @returns {*}
  */
const getActualUid = uidOrEntity => {
    if (typeof uidOrEntity === "string") {
        return uidOrEntity;
    } else if (typeof uidOrEntity === "number") {
        return String(uidOrEntity);
    }
    else if (isObject(uidOrEntity)) {
        if (hasUid(uidOrEntity)) {
            return uidOrEntity[config.uidName];
        }
    }
};







