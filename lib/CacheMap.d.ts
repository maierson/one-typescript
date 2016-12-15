export default class CacheMap<T> {
    paths: {};
    length: number;
    constructor();
    set(key: string | number, value: T): boolean;
    get: (key: any) => T;
    delete: (key: any) => boolean;
    has: (key: any) => boolean;
    forEach: (callback: Function) => void;
    clone: () => CacheMap<T>;
    size(): number;
}
