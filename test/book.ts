import * as One from '../src/index';

/**
 * 
 */
class AbstractEntity {
    id: number;
    uid: string = One.uuid();
    parentRef: string;
    parentKey: string;
    key: string;
    title: string;
    description: string;

    constructor() {
        // TODO make uuid() generation static.
        //this.uid = One.uuid();
    }
}

