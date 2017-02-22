import { IFlushArgs } from './interfaces';
import { hasUid, isArray, isObject } from './util';
import { isOnCache, ensureOnFlushMap, ensureItem, isOnFlushMap } from './cacheUtil';
import { updateRefTos, assignRefToParent } from './ref';
import { config } from './cache';

/* Parses an object tree and puts all the uid items onto 
 the flush map for atomic flushing to the cache */
export const parse = (entity, flushArgs: IFlushArgs) => {
    if (hasUid(entity)) {
        // if it's the same entity on the cache then abort
        if (isOnCache(entity, flushArgs.instance)) return;

        // not the same - cache entity
        _addToFlushMap(entity, flushArgs);
    } else {
        if (isArray(entity)) {
            _parseArray(entity, null, [], flushArgs)
        } else if (isObject(entity)) {
            _parseObject(entity, null, [], flushArgs)
        }
    }
}

const _addToFlushMap = (entity, flushArgs: IFlushArgs) => {
    // Object.freeze(entity);

    ensureOnFlushMap(entity, flushArgs);

    // reset the parent uid to this entity
    // every uid entity is the beginning of a new path and parentUid

    _parseEntity(entity, entity[config.uidName], [], flushArgs);

    // done with building this entity 
    // check its reference paths to make sure nothing is stale
    updateRefTos(
        String(entity[config.uidName]),
        flushArgs
    );
}

const _parseEntity = (entity, parentUid, path: Array<string> = [], flushArgs: IFlushArgs) => {
    for (let key in entity) {
        if (entity.hasOwnProperty(key)) {
            let ref = entity[key];

            if (isArray(ref)) {
                _parseArray(ref, parentUid, [...path, key], flushArgs);
            }

            else if (isObject(ref)) {
                _parseObject(ref, parentUid, [...path, key], flushArgs);
            }
            Object.freeze(ref);
        }
    }
}

const _parseArray = (arr, parentUid, path: Array<string> = [], flushArgs) => {
    arr.forEach((item, index) => {
        if (isArray(item)) {
            _parseArray(item, parentUid, [...path, index], flushArgs)
        } else if (isObject(item)) {
            _parseObject(item, parentUid, [...path, index], flushArgs);
        }
    })
}

const _parseObject = (obj, parentUid, path, flushArgs) => {
    if (hasUid(obj)) {
        _cacheUidObj(obj, parentUid, path, flushArgs);
    } else {
        _parseEntity(obj, parentUid, path, flushArgs);
    }
}

const _cacheUidObj = (entity, parentUid, path: Array<string>, flushArgs: IFlushArgs) => {
    // ensure the entity is on an item with the proper path referenced
    let item = ensureItem(entity, flushArgs);

    // assign all item refs to the parent
    if (parentUid)
        assignRefToParent(item, parentUid, path, flushArgs);

    // check if entity is already cached
    if (isOnCache(entity, flushArgs.instance)
        || isOnFlushMap(entity, flushArgs.flushMap)) return;

    // if not cached add it to the flush map    
    parse(entity, flushArgs);
}