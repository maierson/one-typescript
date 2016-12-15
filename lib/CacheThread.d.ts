export interface ICacheThread {
    current: number;
    nodes: Array<number>;
    addNode: (nodeId: number) => void;
}
export default class CacheThread implements ICacheThread {
    current: number;
    nodes: Array<number>;
    addNode: (nodeId: number) => void;
}
