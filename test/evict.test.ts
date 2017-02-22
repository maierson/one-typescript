import { clearNext } from '../src/evict';
import { config, instances, setTesting } from '../src/cache';
import { expect } from 'chai'
import * as sinon from 'sinon'
import { configure } from '../src/config';
import { isArray, deepClone } from '../src/util';
import * as path from "../src/path";
import * as mocha from 'mocha';
import * as One from '../src/cache';
import CacheMap from '../src/CacheMap';
import { ICacheInstance } from '../src/CacheInstance';
import CacheInstance from '../src/CacheInstance';
import { CacheNode, ICacheNode } from '../src/CacheNode';
import { node } from '../src/locate';

describe("evict", function () {

    "use strict";
    setTesting(true);

    let one;
    function printCache() {
        //      print(one, "CACHE");
    }

    beforeEach(function () {
        setTesting(true);
        // reset config before each call
        one = One.getCache();
    });

    afterEach(function () {
        one.reset();
    });

    it("returns false if nothing evicted", function () {
        expect(one.evict({}).success).to.be.false;
        expect(one.evict().success).to.be.false;
        expect(one.evict(true).success).to.be.false;
    });

    it("fails on non existing uid", function () {
        expect(one.evict(["one", 1]).success).to.be.false;
    })

    it("removes item from cache when evicting", function () {
        let item1 = { uid: 1, value: "test" };
        one.put(item1);
        one.evict(item1);

        expect(one.size()).to.equal(0);
        expect(one.length()).to.equal(2);
    });

    it('evicts simple item', () => {
        let item1 = { uid: 1 };
        one.put(item1);
        one.evict(item1);
        expect(one.get(1)).to.be.undefined;
    })

    it("evicts non-referenced items when parent is evicted", function () {
        let item1 = { uid: 1 };
        let parent = {
            uid: 2,
            item: item1
        };
        one.put(parent);
        one.evict(parent);
        expect(one.length()).to.equal(2);
        expect(one.size()).to.equal(0);
    });

    it("doesn't evict referenced items when parent is evicted", function () {
        let item1 = { uid: 1 };
        let item2 = { uid: 2, item: item1 };
        let item3 = { uid: 3, item: item1 };
        one.put(item2);
        one.put(item3);
        one.evict(item3);

        expect(one.length()).to.equal(3);
        expect(one.size()).to.equal(2);

        expect(one.get(1)).to.not.be.undefined;
        // expect(one.refFrom(1)["2"].length).to.equal(1);
        // expect(one.refFrom(1)["2"][0]).to.equal("item");
        // expect(one.refFrom(1)["3"]).to.be.undefined;

        one.evict(item2);
        expect(one.length()).to.equal(4);
        expect(one.size()).to.equal(0);
        expect(one.get(1)).to.be.undefined;
    });

    it("clears references from an item that was removed from a parent being put", function () {
        let item1 = { uid: 1 };
        let item2 = { uid: 2, val: item1 };
        one.put(item2);

        let editable = one.getEdit(2);
        editable.val = undefined;
        one.put(editable);

        expect(one.get(1)).to.be.undefined;
        //     expect(one.refTo(2)["1"]).to.be.undefined;
    });

    it("evicts an array with all its references", function () {
        let item1 = { uid: 1 };
        let item2 = { uid: 2, item: item1 };
        let item3 = {
            uid: 3,
            item: item2,
            children: [item1]
        };
        let arr = [item1, item2, item3];
        one.put(arr);
        one.evict(arr);
        expect(one.size()).to.equal(0);
        expect(one.length()).to.equal(2);
    });

    it("evicts only the referenced items when evicting an array", function () {
        let item1 = { uid: 1 };
        let item2 = { uid: 2, item: item1 };
        let item3 = {
            uid: 3,
            item: item2,
            children: [item1]
        };
        let item4 = {
            uid: 4,
            item: item1,
            otherItem: item2
        };
        let arr = [item1, item2, item3, item4];
        one.put(arr);
        one.evict([item2, item3]);

        expect(one.size()).to.equal(2);
        expect(one.length()).to.equal(2);
        expect(one.get(1)).to.not.be.undefined;
        expect(one.get(4)).to.not.be.undefined;
        expect(one.get(2)).to.be.undefined;
        expect(one.get(3)).to.be.undefined;
    });

    it("removes references from left over pointing items when evicting an entity", function () {
        let item1 = { uid: 1 };
        let item2 = { uid: 2, item: item1 };
        let item3 = { uid: 3, item: item1 };
        one.put([item2, item3]);

        one.evict(item1);
        expect(one.get(1)).to.be.undefined;
        expect(one.refTo(2)["1"]).to.be.undefined;
        expect(one.refTo(3)["1"]).to.be.undefined;
    });

    it("removes last entity array referenced when deleting array from parent", function () {
        let item1 = { uid: 1 };
        let item2 = { uid: 2, children: [item1] };
        one.put(item2);

        let editable = one.getEdit(2);
        editable.children = undefined;
        one.put(editable);

        expect(one.get(1)).to.be.undefined;
    });

    it("removes entity array referenced when removed from array", function () {
        let item1 = { uid: 1 };
        let item2 = {
            uid: 2,
            item: item1,
            items: [item1]
        };
        one.put(item2); // 0

        let editable = one.getEdit(2);
        delete editable.item;
        one.put(editable);

        editable = one.getEdit(2);
        editable.items = [];
        one.put(editable);

        expect(one.refTo(2)["1"]).to.be.undefined;
        expect(one.get(1)).to.be.undefined;
    });

    it('puts complete arrays', () => {
        let item1 = { uid: 1 };
        let item3 = { uid: 3, item: item1 };
        let item4 = { uid: 4 };
        let item2 = {
            uid: 2,
            items: [item1, item3, item4]
        };
        one.put(item2);
        expect(one.refTo(2).size()).to.equal(3);
        expect(one.refTo(2).paths[1][0]).to.equal('items.0')
        expect(one.refTo(2).paths[3][0]).to.equal('items.1')
        expect(one.refTo(2).paths[4][0]).to.equal('items.2')

        expect(one.refFrom(3).size()).to.equal(1);
        expect(one.refFrom(3).paths[2][0]).to.equal('items.1')
        expect(one.refTo(3).size()).to.equal(1);
        expect(one.refTo(3).paths[1][0]).to.equal('item')

        expect(one.refTo(4).size()).to.equal(0)
        expect(one.refFrom(4).size()).to.equal(1)
        expect(one.refFrom(4).paths[2][0]).to.equal('items.2')
    })

    it("removes entity if is last reference "
        + "when putting entity with removed reference", function () {

            let item1 = { uid: 1 };
            let item3 = {
                uid: 3,
                item: item1
            };
            let item4 = { uid: 4 };
            let item2 = {
                uid: 2,
                item: item1,
                other: item3,
                items: [item1, item3, item4]
            };
            one.put(item2); // 0

            expect(one.size()).to.equal(4);

            let editable2 = one.getEdit(2);
            editable2.item = undefined;
            editable2.items = [];
            one.put(editable2); // 1

            let result = one.get(1);
            expect(result).to.not.be.undefined;

            let editable3 = one.getEdit(3);
            delete editable3.item;
            one.put(editable3);

            result = one.get(1);
            expect(one.get(3)).to.not.be.undefined;

            expect(result).to.be.undefined;
        });

    it("removes references within array when deleting item from cache", function () {
        let item1 = { uid: 1 };
        let item3 = { uid: 3, item: item1 };
        let item2 = { uid: 2, items: [item1, item3] };
        one.put([item2, item3]);

        let items = one.get(2).items;
        expect(items.length).to.equal(2);

        one.evict(3);

        expect(one.get("1a")).to.be.undefined;
        items = one.get(2).items;
        expect(items.length).to.equal(1);
        expect(items[0].uid).to.equal(1);

        // // make sure it didn't alter the previous node
        // one.undo();
        // items = one.get(2).items;
        // expect(items.length).to.equal(2);
    });

    it("removes the referenced property from the pulled item " +
        "if its corresponding uid value has been evicted", function () {
            // this is ONLY when a reference is evicted directly (item is deleted), if it is the child of an evicted
            // parent then it should not be evicted since it contains a reference to each of its parents in the
            // REF_FROM array
            let item1 = { uid: 1 };
            let item2 = { uid: 2, item: item1 };
            one.put(item2);
            one.evict(item1);
            let result = one.get(2);
            expect(one.size()).to.equal(1);
            expect(one.length()).to.equal(2);

            expect(result.item).to.be.undefined;
            // one.undo();
            // result = one.get(2);
            // expect(result.item).to.not.be.undefined;
            // expect(result.item.uid).to.equal(1);
        });

    it("removes a deeper referenced entity when evicting a containing entity up the tree", function () {
        let item1 = { uid: 1 };
        let item2 = { uid: 2, item: item1 };
        let item = {
            uid: 3,
            item: item2
        };
        one.put(item);
        one.evict(item);

        expect(one.size()).to.equal(0);
        expect(one.length()).to.equal(2);
    });

    it("doesn't remove a deeper referenced entity when evicting a containing entity up the tree " +
        "if it has other references", function () {
            let item1 = { uid: 1 };
            let item2 = { uid: 2, item: item1 };
            let item3 = { uid: 3, item: item1 };
            let item = {
                uid: 4,
                item: item2
            };
            one.put(item);
            one.put(item3);
            one.evict(item);
            expect(one.size()).to.equal(2);
            expect(one.length()).to.equal(3);
        });

    it("updates the entire hyerarchy chain upwards when an entity is removed", done => {
        let item1 = { uid: 1 };
        let item2 = {
            uid: 2,
            item: item1
        };
        let item3 = {
            uid: 3,
            item: item2
        };
        one.put(item3);
        one.evict(1);
        let result3 = one.get(3);
        // parents are updated on a timeout to clear the stack - must wait here.
        setTimeout(function () {
            expect(result3.item.item).to.be.undefined;
            done();
        });
    });

    it("updates the entire hyerarchy chain upwards with arrays when an entity is removed", done => {
        let item1 = { uid: 1 };
        let item2 = {
            uid: 2,
            items: [item1]
        };
        let item3 = {
            uid: 3,
            item: item2
        };
        one.put(item3);
        one.evict(1);
        let result3 = one.get(3);
        setTimeout(function () {
            expect(result3.item.items.length).to.equal(0);
            done();
        });
    });

    it("updates the entire hierarchy upwards when an embedded entity is removed from target", function () {
        let item1 = {
            uid: 1,
            item: {
                test: "test"
            }
        };
        let item2 = {
            uid: 2,
            item: item1
        };
        one.put(item2);

        item1 = one.getEdit(1);
        delete item1.item;
        one.put(item1);
        expect(one.get(2).item.item).to.be.undefined;
    })

    it("evicts item with array of arrays repeating", () => {
        let item = { uid: 'top', items: [[{ uid: 1 }, { uid: 2 }], [{ uid: 1 }]] };
        one.put(item);

        one.evict(1);

        expect(one.get(1)).to.be.undefined;

        expect(one.refFrom('top').size()).to.equal(0);
        expect(one.refTo('top').paths[2][0]).to.equal('items.0.0')
        expect(one.refTo('top').size()).to.equal(1)

        expect(one.refFrom(2).get("top")[0]).to.equal("items.0.0");
        expect(one.refFrom(2).size()).to.equal(1);
        expect(one.refTo(2).size()).to.equal(0);
    })

    it("builds prop chain for nested objects", () => {
        let item1 = { uid: 1 };
        let item2 = {
            uid: 2,
            level0: {
                level1: {
                    level2: item1
                }
            }
        }
        one.put(item2);
        expect(one.refTo(2).size()).to.equal(1)
        expect(one.refTo(2).paths["1"][0]).to.equal('level0.level1.level2')
        // TODO evict 1
    })

    it('clears tail of nodes', () => {
        let instance: ICacheInstance = new CacheInstance("test");
        for (let i = 0; i < 3; i++) {
            let node: ICacheNode = new CacheNode(i);
            instance.addNode(node);
        }
        node(instance, 1);
        clearNext(instance);
        expect(instance.size()).to.equal(2)
        expect(instance.length()).to.equal(2)
    })
});



