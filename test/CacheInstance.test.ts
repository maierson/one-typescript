import { ICacheInstance } from '../src/CacheInstance';
import CacheInstance from '../src/CacheInstance';
import CacheMap from '../src/CacheMap';
import CacheRepo from '../src/CacheRepo';
import CacheThread from '../src/CacheThread';
import { expect } from 'chai';

describe("CacheInstance", () => {
    let instance: ICacheInstance;

    beforeEach(() => {
        instance = new CacheInstance("one");
    })

    afterEach(() => {
        instance = null;
    })

    it('creates cache instance', () => {
        expect(instance.repo).to.not.be.undefined;
        expect(instance.repo instanceof CacheRepo).to.be.true;
        expect(instance.thread).to.not.be.undefined;
        expect(instance.thread instanceof CacheThread).to.be.true;
        expect(instance.name).to.equal('one');
        expect(instance.nextNodeKey).to.equal(0);
    })
})


