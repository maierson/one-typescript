import { config, instances, setTesting } from '../src/cache';
import { expect } from 'chai'
import * as sinon from 'sinon'
import { configure } from '../src/config';
import { isArray, deepClone, hasUid } from '../src/util';
import * as path from "../src/path";
import * as mocha from 'mocha';
import * as One from '../src/cache';
import CacheMap from '../src/CacheMap';
import { getCachedItem } from '../src/get';
import CacheItem from '../src/CacheItem';

describe("empty array block test", function () {

    "use strict";

    let one;
    setTesting(true);

    beforeEach(function () {
        // reset config before each call
        one = One.getCache();
    });

    afterEach(function () {
        one.reset();
    });


    it('should not get blocked by empty array', () => {
        const subItem = { uid: 1 }
        const main = {
            uid: 2,
            items1: [],
            items2: [subItem]
        }
        one.put(main);
        //fail
        expect(one.get(1)).to.not.be.undefined;
    })
});


