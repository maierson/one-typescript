import { instances } from './cache';
declare const require: any;
const objectAssign = require('object-assign');

export default class CacheMap<T> {

    instance = {};
    _length = 0;

    constructor() {
    }

    set(key: string | number, value: T): boolean {
        if (typeof this.instance[key] === "undefined") {
            this._length++;
            this.instance[key] = value;
            return true;
        }
        this.instance[key] = value;
        return false;
    }

    get = (key): T => {
        return this.instance[key];
    }

    delete = (key): boolean => {
        if (typeof this.instance[key] !== "undefined" && this._length > 0) {
            let val = this.instance[key];
            delete this.instance[key];
            this._length--;
            return val;
        }
    }

    has = (key): boolean => {
        return typeof this.instance[key] !== 'undefined';
    }

    forEach = (callback: Function) => {
        for (var key in this.instance) {
            if (this.instance.hasOwnProperty(key)) {
                callback(key, this.instance[key]);
            }
        }
    }

    clone = (): CacheMap<T> => {
        let newInstance = objectAssign({}, this.instance);
        let clone: CacheMap<T> = new CacheMap<T>();
        clone.instance = newInstance;
        clone._length = this._length;
        return clone;
    }

    size(): number {
        return this._length;
    }
}