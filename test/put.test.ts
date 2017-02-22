import { config, instances, setTesting } from '../src/cache';
import { expect } from 'chai'
import * as sinon from 'sinon'
import { configure } from '../src/config';
import { isArray, deepClone, hasUid } from '../src/util';
import * as path from "../src/path";
import * as mocha from 'mocha';
import * as One from '../src/cache';
import CacheMap from '../src/CacheMap';
import CacheItem from '../src/CacheItem';

describe("put-get", function () {

    "use strict";

    let one;
    setTesting(true);

    beforeEach(function () {
        setTesting(true);
        // reset config before each call
        one = One.getCache();
    });

    afterEach(function () {
        one.reset();
    });

    it('should put simple uid entity', () => {
        let item = { uid: 1 };
        let item2 = { uid: 2 };
        one.put(item);
        expect(Object.isFrozen(item)).to.be.true;

        let result = one.get(1);
        expect(result).to.not.be.undefined;
        expect(result.uid === item.uid).to.be.true;
        expect(result === item).to.be.true;
        expect(Object.isFrozen(result)).to.be.true;
    })

    it("should put frozen object", function () {
        let item1 = { uid: 1 };
        let item2 = { uid: "2", item: item1, otherItem: undefined };
        one.put(item2);

        expect(one.size()).to.equal(2);
        expect(one.length()).to.equal(1);

        let result2 = one.get(2);
        expect(result2.uid).to.equal("2");
        expect(result2.item.uid).to.equal(1);

        expect(Object.isFrozen(result2)).to.be.true;

        // also can retrieve 1 separately
        let result1 = one.get(1);
        expect(result1).to.not.be.undefined;
        expect(result1.uid).to.equal(1);
        expect(Object.isFrozen(result1)).to.be.true;
    });

    it("should put simple array", function () {
        let item1 = { uid: 1 };
        let item2 = { uid: 2 };
        one.put([item1, item2]);
        let result = one.get(1);
        expect(result).to.not.be.undefined;
        expect(Object.isFrozen(result)).to.be.true;
        let result2 = one.get(2);
        expect(result2).to.not.be.undefined;
        expect(Object.isFrozen(result2)).to.be.true;
        expect(one.size()).to.equal(2);
        expect(one.length()).to.equal(1);
    });

    it("should put item with simple array", function () {
        let item = { uid: 1, items: ["one", "two", "three"] };
        one.put(item);
        let result = one.get(1);
        expect(result).to.not.be.undefined;
        expect(result.items.length).to.equal(3);
        expect(result.items[0]).to.equal("one");
        expect(result.items[1]).to.equal("two");
        expect(result.items[2]).to.equal("three");
        expect(Object.isFrozen(result)).to.be.true;
        expect(Object.isFrozen(result.items)).to.be.true;
    });

    it("should put item with array of arrays", () => {
        let item = {
            uid: 'top',
            items: [
                [{ uid: 1 }, { uid: 2 }],
                [{ uid: 3 }]]
        };
        one.put(item);

        expect(one.refFrom(1).get("top")[0]).to.equal("items.0.0");
        expect(one.refFrom(1).size()).to.equal(1);
        expect(one.refTo(1).size()).to.equal(0);

        expect(one.refFrom(2).get("top")[0]).to.equal("items.0.1");
        expect(one.refFrom(2).size()).to.equal(1);
        expect(one.refTo(2).size()).to.equal(0);

        expect(one.refFrom(3).get("top")[0]).to.equal("items.1.0");
        expect(one.refFrom(3).size()).to.equal(1);
        expect(one.refTo(3).size()).to.equal(0);
    })

    it("should put item with array of arrays repeating", () => {
        let item = { uid: 'top', items: [[{ uid: 1 }, { uid: 2 }], [{ uid: 1 }]] };
        one.put(item);

        expect(one.refFrom(1).get("top")[0]).to.equal("items.0.0");
        expect(one.refFrom(1).get("top")[1]).to.equal("items.1.0");
        expect(one.refFrom(1).size()).to.equal(1);
        expect(one.refTo(1).size()).to.equal(0);

        expect(one.refFrom(2).get("top")[0]).to.equal("items.0.1");
        expect(one.refFrom(2).size()).to.equal(1);
        expect(one.refTo(2).size()).to.equal(0);
    })

    it("should freeze entity deeply", function () {
        let item1 = { uid: 1 };
        let item2 = { uid: 2, item: item1 };
        let item3 = {
            uid: 3,
            item: item2
        };
        one.put(item3);
        let result = one.get(3);
        expect(item3 === result).to.be.true;
        //fail
        expect(Object.isFrozen(result)).to.be.true;
        expect(Object.isFrozen(result.item)).to.be.true;
        expect(Object.isFrozen(result.item.item)).to.be.true;
        expect(Object.isFrozen(item3)).to.be.true;
    });

    it("should put / get even if top entity has no uid", function () {
        let item1 = { uid: 1 };
        let item = {
            val: "test",
            item: item1
        };
        one.put(item);
        let result = one.get(1);
        expect(result).to.not.be.undefined;
        expect(() => {
            result.test = "something";
        }).to.throw(TypeError);
    });

    it("should not put the entity if not changed", function () {
        let item1 = { uid: 1 };
        let state = one.put(item1);
        expect(state.success).to.be.true;
        state = one.put(item1);
        expect(state.success).to.be.false;
    });

    it("should not put array from top entity that has no uid", function () {
        let item1 = { uid: 1 };
        let item2 = { uid: 2, items: [item1] };
        let item = {
            val: "test",
            items: [item2]
        };
        one.put(item);
        expect(one.get(1)).to.not.be.undefined;
        expect(one.get(2)).to.not.be.undefined;
        expect(one.size()).to.equal(2);
        expect(one.length()).to.equal(1);
    });

    it('should get editable clone', () => {
        let item = { uid: 1 };
        one.put(item);
        let result = one.getEdit(1);
        expect(result).to.not.be.undefined;
        expect(Object.isFrozen(result)).to.be.false;
        expect(item === result).to.be.false;
    })

    it('should maintain direct references non editable', () => {
        let item = { uid: 1 };
        let item2 = { uid: 2, item: item };
        one.put(item2);
        let result = one.getEdit(2);
        expect(result.item).to.not.be.undefined;
        expect(result.item === item).to.be.true;
        expect(Object.isFrozen(result.item)).to.be.true;
        expect(result === item2).to.be.false;
        expect(result.uid === item2.uid).to.be.true;
    })

    it('should maintain array references non editable', () => {
        let item = { uid: 1 };
        let item2 = { uid: 2, items: [item] };
        one.put(item2);
        let result = one.getEdit(2);
        expect(result.items).to.not.be.undefined;
        expect(result.items[0] === item).to.be.true;
        expect(Object.isFrozen(result.items)).to.be.false;
        expect(Object.isFrozen(result.items[0])).to.be.true;
        expect(result === item2).to.be.false;
        expect(result.uid === item2.uid).to.be.true;
    })

    it("should put simple array on strong", function () {
        let item = { uid: 1, items: ["one", "two", "three"] };
        one.put(item);
        let result = one.getEdit(1);
        result.items.push("four");
        result.items.push("five");
        one.put(result, true);
        expect(one.get(1).items.length).to.equal(5);
        expect(result.items[0]).to.equal("one");
        expect(result.items[1]).to.equal('two');
        expect(result.items[2]).to.equal("three");
        expect(one.get(1).items[3]).to.equal("four");
        expect(one.get(1).items[4]).to.equal("five");
    });

    it("should update parent when inner uid ref changed"
        + " but keeps other children references unchanged", function () {
            let item1 = { uid: 1 };
            let item2 = { uid: 2 };
            let item3 = {
                uid: 3,
                item1: item1,
                item2: item2
            };
            one.put(item3);

            let item4 = { uid: 4 };
            one.put(item4);
            let edit1 = one.getEdit(1);
            edit1.item = item4;
            one.put(edit1);

            let result = one.get(3);
            expect(item2 === result.item2).to.be.true;
            let result2 = one.get(2);
            expect(item2 === result2).to.be.true;
        });

    it("should update parent when inner uid ref changed " +
        "but keeps other children references unchanged in ARRAY", function () {
            let item = { uid: "item" };
            let item1 = { uid: 1 };
            let item2 = { uid: 2 };
            let item3 = {
                uid: 3,
                item: item,
                children: [item1, item2]
            };
            one.put(item3);

            let item4 = { uid: 4 };
            one.put(item4);
            let edit1 = one.getEdit(1);
            edit1.item = item4;
            one.put(edit1);

            let itemResult = one.get("item");
            expect(item === itemResult).to.be.true;
            let result = one.get(3);
            expect(item2 === result.children[1]).to.be.true;
            let result2 = one.get(2);
            expect(item2 === result2).to.be.true;
        });

    it('should put top item with array but no uid', () => {
        let item1 = { uid: 1 };
        let item2 = { uid: 2 };
        let item = {
            value: "test",
            items: [
                item1, item2
            ]
        };
        one.put(item);
        let result1 = one.get(1);
        expect(result1).to.not.be.undefined;

        let result2 = one.get(2);
        expect(result2).to.not.be.undefined;
    })

    it("should put top array even if it contains no uid items", function () {
        let firstItem = { uid: "first" };
        let item1 = { uid: 1, item: firstItem };
        let item2 = { uid: 2 };
        let item3 = { uid: 3 };
        let item4 = {
            uid: 4,
            value: "four",
            items: [
                item3
            ]
        };
        let item = {
            value: "test",
            items: [
                item1, item2
            ]
        };
        let arr = [item1, item2, item4, item];
        one.put(arr);
        expect(one.get(1)).to.not.be.undefined;
        expect(one.get(firstItem)).to.not.be.undefined;
        expect(one.get(2)).to.not.be.undefined;
        expect(one.get(4)).to.not.be.undefined;
        expect(one.get(3)).to.not.be.undefined;
        expect(one.length()).to.equal(1);
        expect(one.size()).to.equal(5);
    });

    it("should put array of items", function () {
        let item1 = { uid: 1 };
        let item2 = { uid: 2 };
        let item3 = { uid: 3, item: item2 };
        one.put([item1, item3]);
        expect(one.size()).to.equal(3);
        expect(one.length()).to.equal(1);
        expect(one.get(1)).to.not.be.undefined;
        expect(one.get(2)).to.not.be.undefined;
        expect(one.get(3)).to.not.be.undefined;
    });

    it("should replace existing props on existing entity "
        + "when putting new entity that does not have them", function () {
            let item = {
                uid: 1,
                test: "test",
                children: [
                    "one", "two"
                ]
            };
            one.put(item);
            let item2 = {
                uid: 1,
                some: "some",
                children: [
                    "three", "one"
                ]
            };
            one.put(item2);

            let result = one.get(1);

            expect(result.test).to.be.undefined;
            expect(result.some).to.equal("some");

            let hasOne = result.children.some(item => {
                return item === "one";
            });
            expect(hasOne).to.be.true;

            let hasThree = result.children.some(item => {
                return item === "three";
            });
            expect(hasThree).to.be.true;
        });

    it("should put array of entities in one cache update", function () {
        let arr = [{ uid: 1 }, { uid: 2 }, { uid: 3 }];
        one.put(arr);
        expect(one.length()).to.equal(1);
        expect(one.size()).to.equal(3);
        expect(one.get(1)).to.not.be.undefined;
        expect(one.get(2)).to.not.be.undefined;
        expect(one.get(3)).to.not.be.undefined;
    });

    it("should put a complex tree of objects contained in an array", function () {
        let item1 = { uid: 1 };
        let item2 = { uid: 2, item: item1 };
        let item3 = {
            uid: 3,
            item: item2,
            children: [item1]
        };
        let arr = [item1, item2, item3];
        one.put(arr);
        expect(one.length()).to.equal(1);
        expect(one.size()).to.equal(3);
        expect(one.get(1)).to.not.be.undefined;
        let res2 = one.get(2);
        expect(res2).to.not.be.undefined;
        expect(res2.item.uid).to.equal(1);
        let res3 = one.get(3);
        expect(res3).to.not.be.undefined;
        expect(res3.children[0].uid).to.equal(1);
    });

    it("should not add to cache if no uid", function () {
        let existing = { uid: "" };
        one.put(existing);
        expect(one.size()).to.equal(0);
        expect(one.length()).to.equal(0);
    });

    it("should add new item to the cache", function () {
        let item = { uid: 1, value: "one" };
        one.put(item);
        expect(one.size()).to.equal(1);
        expect(one.length()).to.equal(1);
    });

    it("should add inner array objects to the cache", function () {
        let item = {
            uid: 1,
            relative: { uid: 4, value: "four" },
            children: [
                { uid: 2, value: "two" },
                { uid: 3, value: "three" }
            ]
        };
        one.put(item);

        // all items with uid are added to the cache
        expect(one.size()).to.equal(4);
        expect(one.get(1)).to.not.be.undefined;

        let item2 = one.get(2);
        expect(item2).to.not.be.undefined;
        expect(item2.value).to.equal("two");

        let item3 = one.get(3);
        expect(item3).to.not.be.undefined;
        expect(item3.value).to.equal("three");

        let item4 = one.get(4);
        expect(item4).to.not.be.undefined;
        expect(item4.value).to.equal("four");

        // only one extra cache state is added
        expect(one.length()).to.equal(1);
        // with undo we are at the beginning of the nodes array
        let historyState = one.put({ uid: 100 });
    });

    it("should update all pointing parents when putting nested entity", function () {
        let item1: any = { uid: 1 };
        // let item2 = { uid: 2 };
        let item3 = {
            uid: 3,
            //   item: item2,
            otherItem: {
                nested: item1
            }
        };
        let callRes = one.put(item3);
        expect(one.length()).to.equal(1);
        expect(one.size()).to.equal(2);

        // at this point item1 is frozen. To continue editing must get a copy
        item1 = one.getEdit(1);
        // change item 1 and make sure it modified in item2 on current state but not previous
        item1.text = "text";
        let resultState = one.put(item1);
        let result = one.get(3);
        expect(result.otherItem.nested.text).to.equal("text");
        // one.undo();
        // result = one.get(3);
        // expect(result.otherItem.nested.text).to.be.undefined;
    });

    it("should update all pointing parents when putting and entity updated deeply inside another", function () {
        let item1 = { uid: 1, val: "one" };
        let item2 = {
            uid: 2,
            item: item1
        };
        one.put(item2);
        let otherItem1 = {
            uid: 1,
            val: "two"
        };
        let item3 = {
            uid: 3,
            other: otherItem1
        };
        one.put(item3);
        let result = one.get(2);
        expect(result.item.val).to.equal("two");
    });

    it("should update all pointing parents when putting and entity updated deeply inside another's array", function () {
        let item1 = { uid: 1, val: "one" };
        let item2 = {
            uid: 2,
            item: item1
        };
        one.put(item2);
        let otherItem1 = {
            uid: 1,
            val: "two"
        };
        let item3 = {
            uid: 3,
            others: [otherItem1]
        };
        one.put(item3);
        let result = one.get(2);
        expect(result.item.val).to.equal("two");
    });

    it("should add deep inner nested objects to the cache", function () {
        let item1: any = { uid: 1 };
        let item2 = {
            uid: 2,
            item: {
                nested: {
                    deep: item1
                }
            }
        };
        one.put(item2);
        expect(one.length()).to.equal(1);
        expect(one.size()).to.equal(2);

        // change item 1 and make sure it modified in item2 on current state but not previous
        item1 = one.getEdit(item1);
        item1.text = "text";
        one.put(item1);
        let result = one.get(2);
        expect(result.item.nested.deep.text).to.equal("text");
        // one.undo();
        // result = one.get(2);
        // expect(result.item.nested.deep.text).to.be.undefined;
    });

    it("should add inner nested objects in array to the cache", function () {
        let item1: any = { uid: 1 };
        let item2 = {
            uid: 2,
            item: {
                nested: [item1]
            }
        };
        one.put(item2);
        expect(one.length()).to.equal(1);
        expect(one.size()).to.equal(2);

        // change item 1 and make sure it modified in item2 on current state but not previous
        item1 = one.getEdit(item1);
        item1.text = "text";

        one.put(item1);

        let result = one.get(2);
        expect(result.item.nested[0].text).to.equal("text");
        // one.undo();
        // result = one.get(2);
        // expect(result.item.nested[0].text).to.be.undefined;
    });

    it("should cache various nested scenarios", function () {
        let item = {
            uid: 1,
            relative: { uid: 4, value: "four" },
            children: [
                {
                    uid: 2,
                    value: "two",
                    children: [
                        { uid: 5, value: "five" },
                        { uid: 6, value: "six" }
                    ]
                },
                {
                    uid: 3, value: "three"
                }
            ]
        };
        one.put(item);

        //  console.log('FINAL', one.print())        
        // check state
        expect(one.size()).to.equal(6);
        expect(one.length()).to.equal(1);

        // check items
        const result1 = one.get(1);
        expect(result1.children.length).to.equal(2);
        expect(result1.children[0].uid).to.equal(2);
        expect(result1.children[1].uid).to.equal(3);
        const result2 = one.get(2);
        expect(result2.children.length).to.equal(2);
        expect(result2.children[0].uid).to.equal(5);
        expect(result2.children[1].uid).to.equal(6);
    });

    it("keeps non uid references as is", function () {
        let item1 = { uid: 1, value: "one" };
        let item3 = { uid: 3, value: "three" };
        let item2 = {
            uid: 2,
            ref: item1,
            value: { val: "one" },
            value2: "two",
            children: [
                item3,
                { value: "test" }
            ]
        };
        one.put(item2);
        const result = one.get(2);
        expect(result.value.val).to.equal("one");
        expect(result.value2).to.equal("two");
        expect(result.children[1].value).to.equal("test");
    });

    it("adds deeply nested array objects to the cache", function () {
        let item = {
            uid: 1,
            children: [
                [
                    { uid: 2, value: "two" },
                    {
                        uid: 3, children: [
                            { uid: 4, value: "four" }
                        ]
                    }
                ]
            ]
        };
        one.put(item);

        expect(one.size()).to.equal(4);

        let item1 = one.get(1);
        expect(item1).to.not.be.undefined;
        expect(item1.children).to.be.an("array");
        expect(item1.children.length).to.equal(1);

        let child1 = item1.children[0];
        expect(child1).to.be.an("array");
        expect(child1.length).to.equal(2);

        let item2 = one.get(2);
        expect(item2).to.not.be.undefined;
        expect(item2.value).to.equal("two");

        let item3 = one.get(3);
        expect(item3).to.not.be.undefined;
        expect(item3.children).to.be.an("Array");
        expect(item3.children.length).to.equal(1);

        let item4 = one.get(4);
        expect(item4).to.not.be.undefined;
        expect(item4.value).to.equal("four");

        expect(one.length()).to.equal(1);
    });

    it("does not alter the original when putting new", function () {
        let item2 = { uid: 2 };
        let item3 = { uid: 3 };
        let item4 = { uid: 4 };

        let original = {
            uid: 1,
            ref: item2,
            children: [
                item3, item4
            ]
        };
        one.put(original);

        expect(original.ref).to.equal(item2);
        expect(original.children[0]).to.equal(item3);
        expect(original.children[1]).to.equal(item4);
    });

    it("updates array when changed", function () {
        let item2 = { uid: 2 };
        let item3 = { uid: 3 };
        let item4 = { uid: 4 };
        let item = {
            uid: 1,
            ref: item2,
            children: [
                item3
            ]
        };
        one.put(item);

        let editableItem = one.getEdit(1);
        editableItem.children.pop();
        editableItem.children.push(item4);

        one.put(editableItem);

        let result = one.get(1);
        expect(result.children[0].uid).to.equal(4);
    });

    it("does not put if there are no changes to the item", function () {
        let item2 = { uid: 2 };
        let item3 = { uid: 3 };
        let item4 = { uid: 4 };
        let item = {
            uid: 1,
            ref: item2,
            children: [
                item3, item4
            ]
        };
        one.put(item);
        expect(one.length()).to.equal(1);
        expect(Object.isFrozen(item), "Cached item is not frozen").to.be.true;
        expect(item === one.get(1), "Cached item is not identical to passed in item").to.be.true;
        one.put(item);
        expect(one.length()).to.equal(1);
    });

    it('should add reference to new object when exisiting on the cache', () => {
        let item1 = { uid: 1 };
        one.put(item1);
        let item2 = {
            uid: 2,
            item: item1
        }
        one.put(item2);
        one.evict(item1);
        expect(one.get(1)).to.be.undefined;
        //fail
    })

    it("maintains single reference to object "
        + "retrieved in multiple places in deep structure", function () {

            let item1 = { uid: 1, value: "one" };
            let item2 = {
                uid: 2,
                child: item1,
                children: [
                    item1,
                    { value: "test" }
                ]
            };

            one.put(item2);

            let otherItem1 = {
                uid: 1,
                value: "two"
            };

            let item3 = {
                uid: 3,
                // item: item1, // cannot do this - it introduces 2 different instances with same uid in one shot
                otherItem: otherItem1
            };
            one.put(item3);

            let result_2 = one.get(2);
            expect(result_2.child.uid).to.equal(1);
            expect(result_2.children[0].uid).to.equal(1);
            expect(result_2.child === result_2.children[0]).to.be.true;

            // but the value was updated globally
            expect(result_2.child.value).to.equal("two");

            let result_3 = one.get(3);
            expect(result_2.child === result_3.otherItem).to.be.true;
        });

    it('rejects putting 2 instances in one put with same uid')

    it("preserves properties with null values", function () {
        let item1 = { uid: 1, value: "one" };
        let item2 = {
            uid: 2,
            child: null,
            children: [
                item1,
                { value: "test" }
            ]
        };
        one.put(item2);
        let result = one.get(2);
        expect(result.child).to.equal(null);
    });

    it("does not put primitive", function () {
        expect(one.put(1).success).to.be.false;
    });

    it("returns proper boolean when putting item", function () {
        let item2 = { uid: 2 };
        let item3 = { uid: 3 };
        let item4 = { uid: 4 };
        let item = {
            uid: 1,
            value: "test",
            ref: item2,
            children: [
                item3, item4
            ]
        };
        expect(one.put(item).success).to.be.true;
        expect(one.put(item).success).to.be.false;
    });

    it("creates new entity when updating through a referenced entity", function () {
        let item1 = { uid: 1 };
        one.put(item1);
        let item2 = { uid: 2, item: { uid: 1, test: "test" } };
        one.put(item2);
        let result = one.get(1);
        expect(result.test).to.equal("test");
        // one.undo();
        // result = one.get(1);
        // expect(result.test).to.be.undefined;
    });

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
    })

    it("builds the prop chain correctly for objects", function () {
        let item = { uid: 1 };
        let item2 = {
            uid: 2,
            rootItem: item,
            ref: {
                inner: {
                    item: item
                }
            }
        };

        one.put(item2);
        let result = one.get(2);

        let refFrom = one.refFrom(1).paths;
        expect(refFrom["2"]).to.not.be.undefined;
        expect(isArray(refFrom["2"])).to.be.true;
        expect(refFrom["2"][0]).to.equal("rootItem");
        expect(refFrom["2"][1]).to.equal("ref.inner.item");

        let refTo = one.refTo(2).paths;
        expect(refTo["1"]).to.not.be.undefined;
        expect(isArray(refTo["1"])).to.be.true;
        expect(refTo["1"][0]).to.equal("rootItem");
        expect(refTo["1"][1]).to.equal("ref.inner.item");
    });

    it("doesn't reference entity inside another entity", function () {
        let item1 = { uid: 1 };
        let item2 = { uid: 2, item: item1 };
        let item3 = {
            uid: 3,
            item: item2
        };
        one.put(item3);

        let refTo = one.refTo(3);
        expect(refTo["1"]).to.be.undefined;
    });

    it("builds the prop chain correctly for array", function () {
        let item = { uid: 1 };
        let item2 = {
            uid: 2,
            items: [item]
        };
        one.put(item2);
        expect(one.refTo(2).paths["1"][0]).to.equal("items.0");
        expect(one.refFrom(1).paths["2"][0]).to.equal("items.0");
    });

    it("builds the prop chain for inner nested array items", function () {
        let item1 = { uid: 1 };
        let item3 = { uid: 3, item: item1 };
        let item2 = { uid: 2, items: [item1, item3] };
        one.put([item2, item3]);

        let items = one.get(2).items;
        expect(items.length).to.equal(2);

        expect(one.refTo(1).size()).to.equal(0)
        expect(one.refFrom(1).paths[2][0]).to.equal('items.0')
        expect(one.refFrom(1).paths[3][0]).to.equal('item')

        expect(one.refTo(2).paths[1][0]).to.equal('items.0');
        expect(one.refTo(2).paths[3][0]).to.equal('items.1');
        expect(one.refTo(2).size()).to.equal(2);

        expect(one.refFrom(3).paths["2"][0]).to.equal("items.1");
        expect(one.refFrom(3).size()).to.equal(1)
    })

    it("builds the prop chain correctly for nested array", function () {
        let item = { uid: 1 };
        let item2 = {
            uid: 2,
            items: [item, [item]]
        };
        //TODO maybe keep track of number of refs inside an array to know how deep to search (might be overkill and
        // better to just iterate the array to the end when removing references
        one.put(item2);
        expect(one.refTo(2).paths["1"][0]).to.equal("items.0");
        expect(one.refTo(2).size()).to.equal(1);
        expect(one.refFrom(1).paths["2"][0]).to.equal("items.0");
        expect(one.refFrom(1).size()).to.equal(1);
    });

    it("replaces existing entities if putting dirty", function () {
        let item1 = { uid: 1 };
        one.put(item1);
        let item1a = { uid: 1 };
        let item2 = { uid: 2, item: item1a };

        // putting weak should not replace item1 in the cache
        one.put(item2, false);
        let result = one.get(1);
        expect(result === item1a).to.be.true;
        expect(result === item1).to.be.false;
    });

    it("should replace existing entities when putting dirty new version inside array", function () {
        let item1 = { uid: 1 };
        let item2 = { uid: 2, item: item1 };
        one.put(item2);
        let item1a = { uid: 1 };
        // put it weakly
        one.put([item1a]);
        let result = one.get(1);
        expect(result === item1).to.be.false;
        expect(result === item1a).to.be.true;
    });

    it("replaces direct existing entity on dirty put", function () {
        let item1 = { uid: 1 };
        let item1a = { uid: 1, val: "value" };
        one.put(item1);
        one.put(item1a);
        let result = one.get(1);
        expect(result.val).to.equal('value');
    });

    it('removes items from entity when putting over cached version', () => {
        let item = { uid: 1 };
        let item2 = { uid: 2, item: item };

        one.put(item2);
        let editable = one.getEdit(2);
        editable.item = undefined;
        one.put(editable);
        expect(one.get(1)).to.be.undefined;
    })

    it('removes items from entity array when putting over cached version', () => {
        let item = { uid: 1 };
        let item3 = { uid: 3 };
        let item2 = { uid: 2, items: [item3, item] };

        one.put([item2, item3]);
        let editable = one.getEdit(2);
        editable.items = [item3];
        one.put(editable);
        expect(one.get(1)).to.be.undefined;
    })

    it('puts first come first served', () => {
        let item1 = { uid: 1, val: "item1" }
        let item2 = { uid: 1, val: "item2" }
        one.put([item1, item2]);
        expect(one.size()).to.equal(1);
        expect(one.length()).to.equal(1);
        expect(one.get(1).val).to.equal('item1')
    })

    it('puts first come first served nested', () => {
        let item1 = { uid: 1, val: "item1" }
        let item2 = { uid: 1, val: "item2" }
        let item3: any = {
            uid: 3,
            otherItem: item2,
            item: item1,
        }
        one.put(item3);
        expect(one.size()).to.equal(2);
        expect(one.length()).to.equal(1);
        expect(one.get(1).val).to.equal('item2')
    })

    it('puts first come first served in array', () => {
        let item1 = { uid: 1, val: "item1" }
        let item2 = { uid: 1, val: "item2" }
        let item3: any = {
            uid: 3,
            otherItem: [item2],
            item: item1,
        }
        one.put(item3);
        expect(one.size()).to.equal(2);
        expect(one.length()).to.equal(1);
        expect(one.get(1).val).to.equal('item2')
    })

    it('builds multiple nested arrays correctly', () => {
        let item1 = { uid: 1 }
        let item2 = { uid: 2 }
        let item3 = { uid: 3 }
        let item4 = { uid: 4 }
        let item5 = { uid: 5 }
        let main = { uid: 'main', first: [item1, item2, item5], second: [item3, item4, item5] }
        one.put(main);
        expect(one.refTo('main').size()).to.equal(5);
        expect(one.refTo('main').paths[1][0]).to.equal('first.0');
        expect(one.refTo('main').paths[2][0]).to.equal('first.1');
        expect(one.refTo('main').paths[3][0]).to.equal('second.0');
        expect(one.refTo('main').paths[4][0]).to.equal('second.1');
        expect(one.refTo('main').paths[5][0]).to.equal('first.2');
        expect(one.refTo('main').paths[5][1]).to.equal('second.2');
    })

    it('should put parallel objects ', () => {

        const main = {
            uid: 2,
            item1: {
                item2: {
                    item3: {
                        uid: 3,
                    },
                    item4: {
                        uid: 4,
                    }
                }
            },
        }
        one.put(main);
        expect(one.get(3)).to.not.be.undefined;
        expect(one.get(4)).to.not.be.undefined;
    })

    it('should not get blocked by no uid object', () => {
        const subItem = { uid: 1 }
        const main = {
            uid: 2,
            item1: {
                item2: {
                    item3: {
                        uid: 3,
                    },
                    item4: {
                        uid: 4,
                        item7: {
                            uid: 7
                        }
                    },
                    item5: {
                        item6: {
                            test: true,
                            subItem: subItem
                        }
                    }
                }
            },
            // items2: [subItem]
        }
        one.put(main);
        expect(one.get(1)).to.not.be.undefined;
    })

    it('should not get blocked by empty array', () => {
        const subItem = { uid: 1 }
        const main = {
            uid: 2,
            items1: [],
            //  items3: [],
            items2: [subItem]
        }
        one.put(main);
        expect(one.get(1)).to.not.be.undefined;
    })
});


