import { config, instances, setTesting } from '../src/cache';
import { expect } from 'chai'
import * as sinon from 'sinon'
import { configure } from '../src/config';
import { isArray, deepClone } from '../src/util';
import * as path from "../src/path";
import * as mocha from 'mocha';
import * as One from '../src/cache';
import CacheMap from '../src/CacheMap';
import { getCachedItem } from '../src/get';
import CacheItem from '../src/CacheItem';

describe("put-get", function () {

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

    it('puts simple uid entity', () => {
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

    it("puts frozen object", function () {
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

    it("puts simple array", function () {
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

    it("puts item with simple array", function () {
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

    it("freezes entity deeply", function () {
        let item1 = { uid: 1 };
        let item2 = { uid: 2, item: item1 };
        let item3 = {
            uid: 3,
            item: item2
        };
        one.put(item3);
        let result = one.get(3);
        expect(Object.isFrozen(result)).to.be.true;
        expect(Object.isFrozen(result.item)).to.be.true;
        expect(Object.isFrozen(result.item.item)).to.be.true;
        expect(Object.isFrozen(item3)).to.be.true;
        expect(item3 === result).to.be.true;
    });

    it("puts / gets even if top entity has no uid", function () {
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

    it("does not put the entity if not changed", function () {
        let item1 = { uid: 1 };
        let state = one.put(item1);
        expect(state.success).to.be.true;
        state = one.put(item1);
        expect(state.success).to.be.false;
    });

    it("puts array from top entity that has no uid", function () {
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

    it('gets editable clone', () => {
        let item = { uid: 1 };
        one.put(item);
        let result = one.getEdit(1);
        expect(result).to.not.be.undefined;
        expect(Object.isFrozen(result)).to.be.false;
        expect(item === result).to.be.false;
    })

    it('maintains direct references non editable', () => {
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

    it('maintains array references non editable', () => {
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

    it("puts simple array on strong", function () {
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

    it("updates parent when inner uid ref changed"
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

    it("updates parent when inner uid ref changed " +
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

    it('puts top item with array but no uid', () => {
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
    it("puts top array even if it contains no uid items", function () {
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

    it("puts array of items", function () {
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





    // it("detects shallow dirty entity", function () {
    //     let item1 = { uid: 1 };
    //     let item2 = { uid: 2 };
    //     one.put(item1);
    //     expect(one.isDirty(item1)).to.be.false;
    //     expect(one.isDirty(item2)).to.be.true;
    //     expect(one.isDirty(one.get(1))).to.be.false;
    //     expect(one.isDirty(one.getEdit(1))).to.be.true;
    // });

    // // this goes one back, removes all the items after the current state
    // // and adds a new state with the appropriate changes
    // it("puts and updates entity correctly after undo", function () {
    //     let item1 = { uid: 1 };
    //     one.put(item1);
    //     let item2 = { uid: 2, item: item1 };
    //     one.put(item2);

    //     let state = one.undo();
    //     expect(state.success).to.be.true;
    //     expect(state.hasPrev).to.be.false;
    //     expect(state.hasNext).to.be.true;

    //     item1 = one.getEdit(1);
    //     item1.text = "text";
    //     state = one.put(item1);
    //     expect(one.get(1).text).to.equal("text");
    // });

    it("replaces existing props on existing entity "
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

    it("puts array of entities in one cache update", function () {
        let arr = [{ uid: 1 }, { uid: 2 }, { uid: 3 }];
        one.put(arr);
        expect(one.length()).to.equal(1);
        expect(one.size()).to.equal(3);
        expect(one.get(1)).to.not.be.undefined;
        expect(one.get(2)).to.not.be.undefined;
        expect(one.get(3)).to.not.be.undefined;
    });

    it("puts a complex tree of objects contained in an array", function () {
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

    it("does not add to cache if no uid", function () {
        let existing = { uid: "" };
        one.put(existing);
        expect(one.size()).to.equal(0);
        expect(one.length()).to.equal(0);
    });

    it("adds new item to the cache", function () {
        let item = { uid: 1, value: "one" };
        one.put(item);
        expect(one.size()).to.equal(1);
        expect(one.length()).to.equal(1);
    });

    it("adds inner array objects to the cache", function () {
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

    it("updates all pointing parents when putting nested entity", function () {
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
        console.log(callRes)
        expect(one.length()).to.equal(1);
        expect(one.size()).to.equal(2);

        // fail


        // at this point item1 is frozen. To continue editing must get a copy
        item1 = one.getEdit(1);
        // change item 1 and make sure it modified in item2 on current state but not previous
        item1.text = "text";
        let resultState = one.put(item1);
        console.log(resultState)
        let result = one.get(3);
        expect(result.otherItem.nested.text).to.equal("text");
        // one.undo();
        // result = one.get(3);
        // expect(result.otherItem.nested.text).to.be.undefined;
    });

    it("updates all pointing parents when putting and entity updated deeply inside another", function () {
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

    it("updates all pointing parents when putting and entity updated deeply inside another's array", function () {
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

    it("adds deep inner nested objects to the cache", function () {
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

    it("adds inner nested objects in array to the cache", function () {
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

    it("replaces references with uid placeholders", function () {
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

    // it("freezes previous versions of the nodes", function () {
    //     let item1 = {
    //         uid: 1,
    //         children: [
    //             { uid: 2 }
    //         ]
    //     };
    //     one.put(item1);
    //     let result = one.getCurrentNode();
    //     expect(result).to.not.be.undefined;
    //     expect(one.size()).to.equal(2);
    //     try {
    //         result.items.delete(1);
    //     } catch (err) {
    //         console.log("ERROR remove from cache:" + err.message);
    //     }
    //     expect(one.size()).to.equal(2);
    // });

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

    it('adds reference to new object when exisiting on the cache', () => {
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
                item: item1,
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
            expect(result_2.child === result_3.item).to.be.true;
            expect(result_3.item === result_3.otherItem).to.be.true;
            expect(result_2.child === result_3.otherItem).to.be.true;
        });

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

        let refFrom = one.refFrom(1);
        expect(refFrom["2"]).to.not.be.undefined;
        expect(isArray(refFrom["2"])).to.be.true;
        expect(refFrom["2"][0]).to.equal("rootItem");
        expect(refFrom["2"][1]).to.equal("ref.inner.item");

        let refTo = one.refTo(2);
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
        expect(one.refTo(2)["1"][0]).to.equal("items.0");
        expect(one.refFrom(1)["2"][0]).to.equal("items.0");
    });

    it.only("builds the prop chain for inner nested array items", function () {
        let item1 = { uid: 1 };
        let item3 = { uid: 3, item: item1 };
        let item2 = { uid: 2, items: [item1, item3] };
        one.put([item2, item3]);

        one.print();

        let items = one.get(2).items;
        expect(items.length).to.equal(2);

        expect(one.refFrom(3)["2"]).to.equal("items.0");
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
        expect(one.refTo(2)["1"][0]).to.equal("items.0");
        expect(one.refFrom(1)["2"][0]).to.equal("items.0");
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

    it("replace existing entities when putting dirty new version inside array", function () {
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

    //     /* Not sure this should be the lib's responsiblity - it involves scanning ALL arrays
    //     in ALL entities in the cache */
    //     //it("evicts the uid property if existing inside an array", function(){
    //     //    let item1 = {uid:1234};
    //     //    let item2 = {uid:2, uids:[1234]};
    //     //    One.getCache().put([item1, item2]);
    //     //    let result = One.getCache().get(1234);
    //     //    expect(result).to.not.be.undefined;
    //     //    One.getCache().evict(1234);
    //     //    result = One.getCache().get(1234);
    //     //    expect(result).to.be.undefined;
    //     //
    //     //    One.getCache().print();
    //     //    result = One.getCache().get(2);
    //     //    expect(result.uids.length).to.equal(0);
    //     //});







    // describe("cycles", function () {
    //     // TODO
    //     it("clears cyclical items", function () {
    //         // expect(1 === 0, "TODO adapt for cyclical items").to.be.true;
    //         // One.put("{uid:1}");
    //         // let item2 = {uid: 2};
    //         // let item3 = {
    //         //     uid: 3, item: item2
    //         // }
    //         // item2.item = item3;
    //         // One.put(item3);
    //         // One.evict(3);
    //     });
    // });

    // //describe("regexp", function () {
    // //    it("does some", function(){
    // //        let testString =
    // // "imageLeft:-77;imageTop:0;imageWidth:455;imageRotate:0,5;servingWidth:1027;textAlign:center;" +
    // // "fontFamily:Raleway;fontSize:12px;left:0;right:0;top;15px;bottom:20px;mucky:none;stroumpf:bombom;morestuff:ya" +
    // // "andso:again;etc:andsoon"; let cssName    = "etc"; let result; var i, len; let regexp = new RegExp(cssName +
    // // ":(.*?)(;|$)"); let cssMap = {};  console.time("css"); for (i = 0; i < 10000; i++) { if(!cssMap[cssName]){
    // // cssMap[cssName] = new RegExp(cssName + ":(.*?)(;|$)"); } result     = testString.match(cssMap[cssName])[1]; }
    // // console.timeEnd("css");  console.time("loop"); for(var j = 0 ; j < 10000; j++){ let arr = testString.split(";");
    // // len = arr.length; for (i = 0; i < len; i++) { let pair = arr[i]; let key  = cssName + ":"; if (pair.indexOf(key)
    // // > -1) { pair = pair.replace(key, ""); result = pair; break; } } } console.timeEnd("loop");
    // // console.log("result:", result); });  it("does someting ", function(){ let testString =
    // // "imageLeft:-77;imageTop:0;imageWidth:455;imageRotate:0,5;servingWidth:1027;textAlign:center;" + "fontFamily:Raleway;fontSize:12px;left:0;right:0;top;15px;bottom:20px;mucky:none;stroumpf:bombom;morestuff:ya" + "andso:again;etc:andsoon"; let cssName = "servingWidth"; let result; //let regexp = new RegExp(cssName+ ":(.;*?)"); let regexp = new RegExp("(?=" + cssName + ":).+?(?=;|$)"); //let regexp = new RegExp("(?=" + cssName + ":)(.*?)"); console.log(regexp); result = testString.match(regexp)[0]; console.log(result); })  });

    //     it("removes all subsequent states when undo-ing and modifying a state", function () {
    //         "use strict";
    //         let item1 = { uid: 1 };
    //         one.put(item1);
    //         let item2 = { uid: 2 };
    //         one.put(item2);
    //         let state = one.undo();
    //         expect(state.hasNext).to.be.true;
    //         state = one.put({ uid: 1, text: "text" });
    //         expect(state.hasNext).to.be.false;
    //         let result = one.get(1);
    //         expect(result.text).to.equal("text");
    //     });

    //     it("removes subsequent states when evicting", function () {
    //         let item1 = { uid: 1 };
    //         one.put(item1);
    //         let item2 = { uid: 2 };
    //         one.put(item2);
    //         let item3 = { uid: 3 };
    //         one.put(item3);

    //         one.undo();
    //         one.evict(1);
    //         // removes subsequent (has item3) and puts a new one without the item.
    //         expect(one.length()).to.equal(3);
    //         expect(one.size()).to.equal(1);
    //         expect(one.get(2)).to.not.be.undefined;
    //         expect(one.get(1)).to.be.undefined;
    //         expect(one.get(3)).to.be.undefined;
    //     })
});


