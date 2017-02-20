import { ICacheStats } from './interfaces';
export declare const instances: {};
export declare let config: any;
export declare function setTesting(testing: boolean): void;
export interface ICache {
    put: Function;
    get: Function;
    getEdit: Function;
    evict: Function;
    reset: Function;
    size: Function;
    length: Function;
    print: Function;
}
export declare function getCache(instanceName?: string, configuration?: {}): ICache;
export declare const put: (item: {} | {}[]) => void;
export declare const get: (entity: string | number | {} | any[], nodeId?: number) => any;
export declare const getEdit: (uidOrEntityOrArray: string | number | {} | any[], nodeId?: number) => any;
export declare const evict: (uidOrEntityOrArray: string | number | {} | any[]) => ICacheStats;
export declare const print: () => string;
export declare const reset: () => void;
export declare const uuid: () => string;
