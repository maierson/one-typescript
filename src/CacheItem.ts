import CacheMap from './CacheMap';
declare let require: any;
const objectAssign = require('object-assign');

/**
 * Stores a reference to a single entity inside a ICacheNode. It also
 * holds ref_to and ref_from metadata for all outgoing or incoming
 * references to the entity.
 */
export default class CacheItem {
    entity: {};
    ref_from: CacheMap<Array<string>>;
    ref_to: CacheMap<Array<string>>;

    constructor(entity: {}, liveItem?: CacheItem) {
        this.entity = entity;
        // if existing copy the data from the live item else just initialize it
        if (liveItem) {
            // each path is an array of strings so they get duplicated automatically
            this.ref_from = liveItem.ref_from.clone();
            this.ref_to = liveItem.ref_to.clone();
        } else {
            this.ref_from = new CacheMap<Array<string>>();
            this.ref_to = new CacheMap<Array<string>>();
        }
    }

    clone = () => {
        return new CacheItem(this.entity, this);
    }
}