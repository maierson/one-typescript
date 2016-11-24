import { config } from './cache';
import { ICacheInstance } from './CacheInstance';
import { ICacheNode } from './CacheNode';
import CacheMap from './CacheMap';
import CacheItem from './CacheItem';

/**
 * Prints the cache.
 */
export const printCache = (instance: ICacheInstance) => {
    let result = "";
    let index = 0;
    let current = instance.thread.current;

    let nodeIndices = instance.thread.nodes;
    nodeIndices.map(cacheNodeId => {
        let cacheNode: ICacheNode = instance.repo.get(cacheNodeId);

        let streamData = "";
        let state = index + ":" + streamData + "[" + stringifyMap(cacheNode.items) + "]\n\n";
        if (index === current) {
            state = "-> " + state;
        }
        result += state;
        index++;
    });

    result = result.substring(0, (result.length - 2));

    index = 0;

    return "\n------ One -------"
        + "\nSTACK:\n" + result
        + "\n\nCONFIG:" + JSON.stringify(config, null, 2)
        + "\n\nREPO SIZE:" + instance.repo.length
        + "\n===================\n";
};

const stringifyMap = (map: CacheMap<CacheItem>) => {
    let result = "";

    map.forEach((key, item: CacheItem) => {
        let itemResult = JSON.stringify(item, null, 2);
        result += itemResult + ",\n";
    })

    return result;
}