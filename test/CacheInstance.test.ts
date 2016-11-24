import { CacheNode, ICacheNode } from '../src/CacheNode';
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

    it('adds node only once', () => {
        expect(instance.length()).to.equal(0);
        let node: ICacheNode = new CacheNode(0);
        expect(instance.addNode(node)).to.be.true;
        expect(instance.length()).to.equal(1);
        expect(instance.addNode(node)).to.be.false;
        expect(instance.length()).to.equal(1);
        expect(instance.size()).to.equal(1);
    })

    it('adds multiple nodes', () => {
        for (let i = 0; i < 3; i++) {
            let node: ICacheNode = new CacheNode(i);
            instance.addNode(node);
        }
        expect(instance.length()).to.equal(3);
        expect(instance.size()).to.equal(3);
    })
})


