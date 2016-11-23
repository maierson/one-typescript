import { CacheNode, ICacheNode } from '../src/CacheNode';
import { ICacheInstance } from '../src/CacheInstance';
import CacheInstance from '../src/CacheInstance';
import CacheMap from '../src/CacheMap';
import CacheRepo from '../src/CacheRepo';
import CacheThread from '../src/CacheThread';
import { expect } from 'chai';

describe("CacheRepo", () => {
    let repo: CacheRepo;

    beforeEach(() => {
        repo = new CacheRepo();
    })

    afterEach(() => {
        repo = null;
    })

    it('creates cache instance', () => {
        expect(repo.items instanceof CacheMap).to.be.true;
        expect(repo.length).to.equal(0);
        expect(typeof repo.get === 'function').to.be.true;
        expect(typeof repo.add === 'function').to.be.true;
        expect(typeof repo.delete === 'function').to.be.true;
    })

    it('adds node to the repo', () => {
        let node: ICacheNode = new CacheNode(0);
        repo.add(node);
        let node1: ICacheNode = new CacheNode(1);
        let node2: ICacheNode = new CacheNode(2);
        repo.add(node);
        repo.add(node1);
        repo.add(node2);
        expect(repo.length).to.equal(3);
        expect(repo.get(2)).to.equal(node2);
        expect(repo.get(1)).to.equal(node1);
        expect(repo.get(0)).to.equal(node);
    })

    it('adds deletes from the repo', () => {
        let node: ICacheNode = new CacheNode(0);
        let node1: ICacheNode = new CacheNode(1);
        let node2: ICacheNode = new CacheNode(2);
        repo.add(node);
        repo.add(node1);
        repo.add(node2);
        repo.delete(1);
        expect(repo.length).to.equal(2);
        expect(repo.get(2)).to.equal(node2);
        expect(repo.get(0)).to.equal(node);
        expect(repo.get(1)).to.be.undefined;
    })
})


