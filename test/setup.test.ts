import { config, instances, setTesting } from '../src/cache';
import { expect } from 'chai'
import * as sinon from 'sinon'
import { configure } from '../src/config';
import { isArray, deepClone, cacheSize } from '../src/util';
import * as path from "../src/path";
import * as mocha from 'mocha';
import * as One from '../src/cache';
import CacheMap from '../src/CacheMap';

describe("setup", function () {

    let one;

    beforeEach(function () {
        setTesting(false);
        // reset config before each call
        one = One.getCache();
    });

    afterEach(function () {
        one.reset();
    });

    it("returns singleton instance", function () {
        expect(One.getCache() === One.getCache()).to.be.true;
    });

    it('configures with default', () => {
        expect(config).to.not.be.undefined;
        expect(config.uidName).to.not.be.undefined;
        expect(config.maxHistoryStates).to.equal(1000);
    })

    it("finds one lib", function () {
        expect(one).to.not.be.undefined;
    });

    it("initializes with no map", function () {
        console.log("One " + JSON.stringify(one))
        expect(one).to.not.be.null;
        expect(one.size()).to.equal(0);
        expect(one.length()).to.equal(0);
    });

    it('initializes second instance', () => {
        let two = One.getCache('two');
        expect(two).to.not.be.undefined;
        expect(instances['two']).to.equal(two);
        expect(instances['one']).to.not.be.undefined;
        expect(one.size()).to.equal(0);
        expect(one.length()).to.equal(0);
    })

    it('initializes instance', () => {
        // public api
        expect(typeof one.put === 'function').to.be.true;
        expect(typeof one.get === 'function').to.be.true;
        expect(typeof one.getEdit === 'function').to.be.true;
        expect(typeof one.evict === 'function').to.be.true;
        expect(typeof one.reset === 'function').to.be.true;
        expect(typeof one.print === 'function').to.be.true;

        // these guys are private in closure            
        expect(one.repo).to.be.undefined;
        expect(one.mainThread).to.be.undefined;
        expect(one.nextNodeKey).to.be.undefined;
    })

    it('does not provide test methods', () => {
        expect(typeof one.refTo === 'function').to.be.false;
        expect(typeof one.refFrom === 'function').to.be.false;
    })
});


