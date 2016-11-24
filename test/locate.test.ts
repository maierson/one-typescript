import { config, instances, setTesting } from '../src/cache';
import { expect } from 'chai'
import * as sinon from 'sinon'
import { configure } from '../src/config';
import { isArray, deepClone, cacheSize, hasUid, isEmpty } from '../src/util';
import * as path from "../src/path";
import * as mocha from 'mocha';
import * as One from '../src/cache';
import CacheMap from '../src/CacheMap';
import { ICacheNode, CacheNode } from '../src/CacheNode';
import { node } from '../src/locate';
import { ICacheInstance } from '../src/CacheInstance';
import CacheInstance from '../src/CacheInstance';
import { ICacheStats } from '../src/interfaces';

describe("locate", function () {

    "use strict";

    let one, callStats;

    beforeEach(function () {
        one = One.getCache("one");
        one.put({ uid: 1 })
        one.put({ uid: 2 })
        callStats = one.put({ uid: 3 })
    });

    afterEach(function () {
        one = null;
    });

    it('throws if node id not a number', () => {
        let instance: ICacheInstance = new CacheInstance("test");
        expect(() => { node(instance, "test") }).to.throw("The node id must be a number");
    })

    it('returns false stats on out of range nodeId', () => {
        let instance: ICacheInstance = new CacheInstance("test");
        let result: ICacheStats = node(instance, 10) as ICacheStats;
        expect(result.success).to.be.false;
        expect(result.nodeId).to.equal(-1);
        expect(result.length).to.equal(0);
        expect(result.name).to.equal('test');
    })

    it('returns true stats on valid nodeId ', () => {
        let instance: ICacheInstance = new CacheInstance("test");
        for (let i = 0; i < 3; i++) {
            let node: ICacheNode = new CacheNode(i);
            instance.addNode(node);
        }
        let result: ICacheStats = node(instance, 1) as ICacheStats;
        expect(result.success).to.be.true;
        expect(result.nodeId).to.equal(1);
        expect(result.length).to.equal(3);
        expect(result.name).to.equal('test');
    })
});





