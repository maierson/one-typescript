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
    setTesting(false);

    it("should put to default cache", function () {
        let item = { uid: 1 };
        One.put(item)
        let result = One.get(1);
        expect(result).to.not.be.undefined;
        expect(result).to.equal(item);
        expect(Object.isFrozen(result)).to.be.true;
    });

    it('should getEdit from default cache', () => {
        let item = { uid: 1 }
        One.put(item);
        let result = One.getEdit(1);
        expect(result).to.not.be.undefined;
        expect(result === item).to.be.false;
    })

    it('should evict from default cache', () => {
        One.put({ uid: 1 });
        expect(One.get(1)).to.not.be.undefined;
        One.evict(1);
        expect(One.get(1)).to.be.undefined;
    })

    it('should print default cache', function () {
        expect(One.print()).to.not.be.undefined;
    })

    it('should reset default cache', function () {
        One.put({ uid: 1 })
        One.put({ uid: 2 })
        One.reset();
        expect(One.get(1)).to.be.undefined;
        expect(One.get(2)).to.be.undefined;
    })

    it('should generate uuid', () => {
        let uuid1 = One.uuid();
        let uuid2 = One.uuid();
        expect(uuid1).to.not.be.undefined;
        expect(typeof uuid1 === 'string').to.be.true;
        expect(uuid1.length > 5).to.be.true;
        expect(uuid2).to.not.be.undefined;
        expect(uuid1 === uuid2).to.be.false;
    })
});


