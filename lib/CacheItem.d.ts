import CacheMap from './CacheMap';
export default class CacheItem {
    entity: any;
    mapTo: CacheMap<Array<string>>;
    mapFrom: CacheMap<Array<string>>;
    constructor(entity: any, liveItem?: CacheItem);
    clone: () => CacheItem;
}
