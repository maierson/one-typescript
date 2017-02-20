import { ICacheStats } from './interfaces';
import * as util from './util';
import { configure, defaultConfig } from './config';
import { getCurrentNode } from './locate';
import { putItem } from './put';
import { printCache } from './print';
import CacheInstance from './CacheInstance';
import { ICacheInstance } from './CacheInstance';
import { cacheSize, cacheLength } from './util';
import { getCachedItem, getItem, getEditItem } from './get';
import { evictItem } from './evict';

/**
 * All current instances of the cache.
 */
export const instances = {};
export let config;
let cacheTest: boolean = false;

export function setTesting(testing: boolean) {
    cacheTest = testing;
}

export interface ICache {
    /* add item to the cache recursively and freeze deeply */
    put: Function,

    /* get frozen item from the cache */
    get: Function,

    /* get unfrozen(shallow) item copy from the cache 
    inner uid references are still frozen and not copied */
    getEdit: Function,

    /* remove item from the cache, does not modify the current node
    but creates a new one without the evicted item in it */
    evict: Function,

    /* resets the cache and evicts all items*/
    reset: Function,

    /* number of items in the current node */
    size: Function,

    /* number of nodes in the cache */
    length: Function,

    /* put it on paper so I can look at it */
    print: Function,
}

/**
 * Creates and returns a single static instance of the cache
 * unique for the respective instance name.
 */
export function getCache(instanceName = "one", configuration: {} = defaultConfig): ICache {
    if (!config /*&& !instances*/) {
        config = configure(configuration);
    }
    // if (!instances) {
    //     instances = {};
    // }
    if (!instances[instanceName]) {
        instances[instanceName] = createCache(instanceName);
    }
    if (window) {
        if (window[instanceName] === undefined) {
            window[instanceName] = instances[instanceName];
        }
    }
    return instances[instanceName];
}

export const put = (item: {} | Array<{}>) => {
    getCache().put(item);
}

export const get = (entity: string | number | {} | Array<any>, nodeId?: number) => {
    return getCache().get(entity, nodeId);
}

export const getEdit = (uidOrEntityOrArray: string | number | {} | Array<any>, nodeId?: number) => {
    return getCache().getEdit(uidOrEntityOrArray, nodeId);
}

export const evict = (uidOrEntityOrArray: string | number | {} | Array<any>): ICacheStats => {
    return getCache().evict(uidOrEntityOrArray);
}

export const print = (): string => {
    return getCache().print();
}

export const reset = (): void => {
    getCache().reset();
}

export const uuid = (): string => {
    // UUID
    var lut = [];
    for (var i = 0; i < 256; i++) {
        lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
    }

    // GUID generator http://jsperf.com/uuid-generator-opt/8
    var d0 = Math.random() * 0x100000000 | 0;
    var d1 = Math.random() * 0x100000000 | 0;
    var d2 = Math.random() * 0x100000000 | 0;
    var d3 = Math.random() * 0x100000000 | 0;
    return lut[d0 & 0xFF] + lut[d0 >> 8 & 0xFF] + lut[d0 >> 16 & 0xFF]
        + lut[d0 >> 24 & 0xFF] + '-' + lut[d1 & 0xFF]
        + lut[d1 >> 8 & 0xFF] + '-' + lut[d1 >> 16 & 0x0f | 0x40]
        + lut[d1 >> 24 & 0xFF] + '-' + lut[d2 & 0x3f | 0x80]
        + lut[d2 >> 8 & 0xFF] + '-' + lut[d2 >> 16 & 0xFF]
        + lut[d2 >> 24 & 0xFF] + lut[d3 & 0xFF] + lut[d3 >> 8 & 0xFF]
        + lut[d3 >> 16 & 0xFF] + lut[d3 >> 24 & 0xFF];
}

function createCache(name: string): ICache {

    const instance: ICacheInstance = new CacheInstance(name);

    /**
     * Resets the cache to empty.
     */
    const reset = () => {
        instance.reset();
    };

    const put = (item: {} | Array<{}>): ICacheStats => {
        return putItem(item, instance);
    }

    /**
     * @param entity entity or array of entities or entity uids to retrieve frozen from the cache
     * @param nodeId optional id of a node to get the entities from in case of time travel.
     */
    const get = (entity: string | number | {} | Array<any>, nodeId?: number) => {
        return getItem(entity, instance, nodeId);
    }

    /**
     * @param entity entity or array of entities or entity uids to retrieve cloned and editable from the cache
     * @param nodeId optional id of a node to get the entities from in case of time travel.
     */
    const getEdit = (uidOrEntityOrArray: string | number | {} | Array<any>, nodeId?: number) => {
        return getEditItem(uidOrEntityOrArray, instance, nodeId);
    }

    const evict = (uidOrEntityOrArray: string | number | {} | Array<any>): ICacheStats => {
        return evictItem(uidOrEntityOrArray, instance);
    }

    const size = () => {
        return cacheSize(instance);
    }

    const length = () => {
        return cacheLength(instance);
    }

    const print = () => {
        return printCache(instance);
    }

    let result = {
        put: put,
        get: get,
        getEdit: getEdit,
        evict: evict,
        reset: reset,
        size: size,
        length: length,
        print: print,
    }

    if (cacheTest === true) {
        (result as any).refTo = uid => {
            let item = getCachedItem(uid, instance);
            return item.mapTo;
        };
        (result as any).refFrom = uid => {
            let item = getCachedItem(uid, instance);
            return item.mapFrom;
        };
    }

    return result;
}