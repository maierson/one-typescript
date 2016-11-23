import { REF_FROM, REF_TO } from './constants';
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

    let printFinal = "\n------ One -------"
        + "\nSTACK:\n" + result
        + "\n\nCONFIG:" + JSON.stringify(config, null, 2)
        //   + "\n\nHISTORY:" + JSON.stringify(getHistoryState(), null, 2)
        + "\n\nREPO SIZE:" + instance.repo.length
        + "\n===================\n";
    console.log(printFinal);
    // fail
    return printFinal;
};

const stringifyMap = (map: CacheMap<CacheItem>) => {
    let result = "";
    //let arr = [...map.values()];
    //console.log(map)
    map.forEach((key, item: CacheItem) => {
        let itemResult = JSON.stringify(item, null, 2);
        //if (itemResult.indexOf(REF_FROM) >= 0 && item.ref_from) {
        // itemResult = itemResult.replace('"' + REF_FROM + '": {}', '"' + REF_FROM + '"' + ": " + JSON.stringify(item.ref_from));
        // }
        //if (itemResult.indexOf(REF_TO) >= 0 && item.ref_to) {
        //itemResult = itemResult.replace('"' + REF_TO + '": {}', '"' + REF_TO + '"' + ": " + JSON.stringify(item.ref_to);
        //}
        result += itemResult + ",\n";
    })

    if (result.length > 2) {
        result = result.substring(0, result.length - 2);
    }
    return result;
};