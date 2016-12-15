import CacheMap from './CacheMap';
export default class CacheItem {
    entity: {};
    mapTo: CacheMap<Array<string>>;
    mapFrom: CacheMap<Array<string>>;
    constructor(entity: {}, liveItem?: CacheItem);
    clone: () => CacheItem;
}
