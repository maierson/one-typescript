import { IFlushArgs } from './interfaces';
import CacheItem from './CacheItem';
export declare const assignRefToParent: (refItem: any, parentUid: any, path: string[], flushArgs: IFlushArgs) => void;
export declare const updatePointers: (flushArgs: IFlushArgs) => void;
export declare const updateRefFroms: (item: CacheItem, flushArgs: IFlushArgs) => void;
export declare const updateRefTos: (entityUid: any, flushArgs: IFlushArgs) => void;
