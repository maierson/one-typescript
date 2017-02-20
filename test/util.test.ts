import { config, instances, setTesting } from '../src/cache';
import { expect } from 'chai'
import * as sinon from 'sinon'
import { configure } from '../src/config';
import { isArray, deepClone, cacheSize, hasUid, isEmpty } from '../src/util';
import * as path from "../src/path";
import * as mocha from 'mocha';
import * as One from '../src/cache';
import CacheMap from '../src/CacheMap';

describe("Utils", function () {

    "use strict";

    let one;

    beforeEach(function () {
        let config = {
            uidName: "uid",
            maxHistoryStates: 1000
        }
        // reset config before each call
        one = One.getCache("one", config);
    });

    afterEach(function () {
        one = null;
    });

    function getTestObj() {
        return {
            a: 'b',
            b: {
                c: [],
                d: ['a', 'b'],
                e: [{}, { f: 'g' }],
                f: 'i'
            },
            c: { uid: 1 }
        };
    }

    it('should not find isArray if missing splice', () => {
        let obj: any = {};
        obj["length"] = 0;
        expect(isArray(obj)).to.be.false;
    })

    it('should not find array if length is enumerable', () => {
        let obj: any = {};
        obj["length"] = 0;
        obj["splice"] = () => { };
        expect(isArray(obj)).to.be.false;
    })

    it('finds empty obj value', () => {
        let obj = {};
        expect(isEmpty(obj)).to.be.true;
    })

    it('finds empty obj value', () => {
        let obj = {};
        obj["test"] = "test";
        expect(isEmpty(obj)).to.be.false;
    })

    describe("clone", function () {
        it("hasUid should return false on non object", function () {
            expect(hasUid(null)).to.be.false;
        });

        it("should not clone if not object or array", function () {
            expect(deepClone(2)).to.equal(2);
        });

        it("should clone date", function () {
            let date: any = new Date();
            let item1 = { uid: 1, date: date };
            let result = deepClone(item1);
            expect(result.date).to.not.be.undefined;
            expect(result.date === date).to.be.false;
            expect(result.date.time === date.time).to.be.true;
            expect(Object.isFrozen(result.date)).to.be.true;
        });

        it("should clone deeply", function () {
            let obj = getTestObj();
            let result = deepClone(obj);
            expect(result).to.not.be.undefined;
            expect(obj === result).to.be.false;
            expect(Object.isFrozen(result)).to.be.true;
        });

        it("should replace item", function () {
            let obj = getTestObj();
            let result = deepClone(obj, { uid: 1, text: "test" });
            expect(result.c).to.not.be.undefined;
            expect(Object.isFrozen(result.c)).to.be.true;
            expect(result.c.text).to.equal("test");
            expect(() => {
                result.c.text = "new"
            }).to.throw(TypeError);
        });

        it("clones an object deeply", function () {
            let date = new Date();
            let item1 = { uid: 1 };
            let item2 = { uid: 2, date: date };
            let item3 = { uid: 3, arr: [1, 2] };
            let item4 = {
                uid: 4,
                arr: [1, item1, "string", [item1, item2]],
                item: item3
            };
            let result = deepClone(item4);
            expect(result === item4).to.be.false;
            expect(result.uid).to.equal(4);
            expect(result.arr[0]).to.equal(1);
            expect(result.arr[1] == item1).to.be.true;
            expect(result.arr[1].uid).to.equal(1);
            expect(result.arr[2]).to.equal("string");

            expect(isArray(result.arr[3])).to.be.true;
            expect(result.arr[3][0] === item1).to.be.true;
            expect(result.arr[3][0].uid).to.equal(1);

            // item 2 inner clone
            expect(result.arr[3][1] === item2).to.be.true;
            expect(result.arr[3][1].uid).to.equal(2);
            // stops at the parent uid item
            expect(result.arr[3][1].date === date).to.be.true;
            expect(result.arr[3][1].date.getTime()).to.equal(date.getTime());
        });

        it("returns the object when cloning with replace of itself", function () {
            let item1 = { uid: 1 };
            let result = deepClone(item1, item1, false);
            expect(item1 === result).to.be.true;
        });

        it("should replace item not freeze", function () {
            let obj = getTestObj();
            expect(Object.isFrozen(obj.c)).to.be.false;
            let result = deepClone(obj, { uid: 1, text: "test" }, false);

            expect(result.c).to.not.be.undefined;
            expect(Object.isFrozen(result.c)).to.be.false;
            expect(result.c.text).to.equal("test");
        });

        it("has uid", function () {
            expect(hasUid({ uid: 1 })).to.be.true;
            expect(hasUid({})).to.be.false;
        })
    });

    describe("clear", function () {
        it("clears the cache", function () {
            let item1 = { uid: 1 };
            let item2 = { uid: 2 };
            let item3 = {
                uid: 3,
                item: item1
            };
            one.put(item3);
            one.put(item2);
            one.reset();
            expect(one.size()).to.equal(0);
            expect(one.length()).to.equal(0);
        })
    });

    describe("config", function () {

        it("fails to set config if there are items in the cache", function () {
            let a = { uid: 1 };
            one.put(a);
            let config = {
                uidName: "uuid"
            }
            expect(() => {
                one.config(config)
            }).to.throw(Error);
        });

        it("it does not configure a cleared cache", function () {
            let a = { uid: 1 };
            one.put(a);
            one.reset();
            let conf = {
                uidName: "uniqueId"
            };
            One.getCache('one', conf);
            expect(config.uidName).to.equal("uid");
        });

        //it("maintains the correct number of configured history states", function () {
        //    expect(0, "Not impletmented").to.equal(1);
        //});
    });

    describe("print", function () {
        it("prints", function () {
            let item = { uid: 1 };
            let item2 = {
                uid: 2,
                child: item
            };
            one.put(item2);
            expect(one.get(1)).to.not.be.undefined;
            expect(one.print()).to.not.be.undefined;
        });

        it("prints empty", function () {
            expect(() => {
                one.print()
            }).to.not.throw(Error);
        })
    });
});





