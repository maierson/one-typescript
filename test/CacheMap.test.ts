import { expect } from 'chai'
import * as sinon from 'sinon'
import { configure } from '../src/config';
import { isArray, deepClone } from '../src/util';
import * as path from "../src/path";
import * as mocha from 'mocha';
import * as One from '../src/cache';
import CacheMap from '../src/CacheMap';
import { flush } from '../src/flush';

describe("CacheMap", () => {
    let flushMap;

    beforeEach(() => {
        flushMap = new CacheMap();
    })

    afterEach(() => {
        flushMap = null;
    })

    it('creates flush map', () => {
        expect(flushMap.size()).to.equal(0);
    })

    it('sets flush map item', () => {
        flushMap.set("node", {});
        expect(flushMap.size()).to.equal(1);
        expect(flushMap.get("node")).to.not.be.undefined;
    })

    it('does not increase length when resetting item', () => {
        flushMap.set("node", {});
        expect(flushMap.size()).to.equal(1);
        let item = { test: "other" }
        flushMap.set("node", item);
        expect(flushMap.size()).to.equal(1);
        expect(flushMap.get("node")).to.equal(item);
    })

    it('removes item', () => {
        let node1 = { val: 1 };
        let node2 = { val: 2 };
        flushMap.set("node1", node1);
        flushMap.set("node2", node2);
        expect(flushMap.size()).to.equal(2);

        let result = flushMap.delete("node1")
        expect(flushMap.size()).to.equal(1);
        expect(flushMap.get("node1")).to.be.undefined;
        expect(result).to.equal(node1);

        flushMap.delete("node2")
        expect(flushMap.size()).to.equal(0);
        expect(flushMap.get("node2")).to.be.undefined;
    })

    it('iterates over map', () => {
        flushMap.set("node1", "one");
        flushMap.set("node2", "two");
        flushMap.set("node3", "three");
        let result = [];
        flushMap.forEach((key, value) => {
            result.push(key);
            result.push(value);
        })
        expect(result.length).to.equal(6);
        expect(result[0]).to.equal('node1')
        expect(result[1]).to.equal('one')
        expect(result[2]).to.equal('node2')
        expect(result[3]).to.equal('two')
        expect(result[4]).to.equal('node3')
        expect(result[5]).to.equal('three')
    })
})


