import { config, instances } from '../src/cache';
import { expect } from 'chai'
import * as sinon from 'sinon'
import { configure } from '../src/config';
import { isArray, deepClone } from '../src/util';
import * as path from "../src/path";
import * as mocha from 'mocha';
import * as One from '../src/cache';
import CacheMap from '../src/CacheMap';

describe("get", function () {

    "use strict";

    let one;

    function printCache() {
        //      print(one, "CACHE");
    }

    beforeEach(function () {
        // reset config before each call
        one = One.getCache();
    });

    afterEach(function () {
        one.reset();
    });

    it("gets array of items in requested order", function () {
        let item1 = { uid: 1 };
        let item2 = { uid: 2 };
        let item3 = { uid: 3, item: item2 };
        one.put([item1, item3]);
        let result = one.get([1, 3, item2]);
        expect(isArray(result)).to.be.true;
        expect(result[0].uid).to.equal(1);
        expect(result[1].uid).to.equal(3);
        expect(result[2].uid).to.equal(2);
        // aslo check identity
        expect(item2 === result[1].item).to.be.true;
    });

    it("gets undefined for non existing cached item", function () {
        expect(one.get(1)).to.be.undefined;
        expect(one.getEdit(1)).to.be.undefined;
        expect(one.get({ uid: 1 })).to.be.undefined;
    });

    it("gets editable entity that is a clone of the cached entity", function () {
        let item1 = { uid: 1 };
        one.put(item1);
        let result = one.get(1);
        let resultEdit = one.getEdit(1);
        expect(resultEdit).to.not.be.undefined;
        expect(result === resultEdit).to.be.false;
        expect(result.uid).to.equal(1);
        resultEdit.test = "something";
        expect(resultEdit.test).to.equal("something");
        expect(result.test).to.be.undefined;
    });

    it("gets editable array of clones", function () {
        let item1 = { uid: 1 };
        let item2 = { uid: 2 };
        let item3 = { uid: 3, item: item2 };
        one.put([item1, item3]);
        let result = one.getEdit([1, 3, item2]);

        expect(isArray(result)).to.be.true;
        expect(result[0].uid).to.equal(1);
        expect(result[1].uid).to.equal(3);
        expect(result[2].uid).to.equal(2);
        // aslo check identity
        expect(item2 === result[1].item).to.be.true;
        expect(result[2] === result[1].item).to.be.false;
    });

    it("maintains deep objects without uid editable when getting editable", function () {
        let firstObj = { text: "test" };
        let secondObj = { text: "new" };
        let item2 = { uid: 2 };
        let item3 = { uid: 3 };
        let item = {
            uid: 1,
            item: firstObj,
            item3: item3,
            children: [
                "something",
                secondObj,
                item2
            ]
        };
        one.put(item);

        // check object reference to be frozen and identical to original
        let result = one.get(1);
        expect(Object.isFrozen(result.item)).to.be.true;
        expect(firstObj === result.item).to.be.true;

        expect(Object.isFrozen(result.children)).to.be.true;
        expect(result.children[1] === secondObj).to.be.true;
        expect(result === item).to.be.true;
        expect(Object.isFrozen(result.item3)).to.be.true;
        expect(result.item3 === item3).to.be.true;
        expect(Object.isFrozen(result.children[2])).to.be.true;
        expect(result.children[2] === item2).to.be.true;

        // check object reference to be frozen and identical to original after editable
        let editableResult = one.getEdit(1);
        // non uid items come out editable
        expect(Object.isFrozen(editableResult.item)).to.be.false;
        // non uid items are replaced and made editable
        expect(firstObj === editableResult.item).to.be.false;
        // arrays are made editable
        expect(Object.isFrozen(editableResult.children)).to.be.false;
        // their non uid items are replaced and made editable
        expect(editableResult.children[1] === secondObj).to.be.false;
        // maintain uid reference as is
        expect(Object.isFrozen(result.item3)).to.be.true;
        expect(result.item3 === item3).to.be.true;
        // maintain all uid items (even nested in array) as is
        expect(Object.isFrozen(result.children[2])).to.be.true;
        expect(result.children[2] === item2).to.be.true;
        // new editable parent
        expect(editableResult === item).to.be.false;
    });

    it("maintins deep objects with uid identical when getting editable", function () {
        let item1 = { uid: 1 };
        let item2 = { uid: 2, item: item1 };
        one.put(item2);
        let result = one.get(2);
        expect(result.item === item1).to.be.true;

        result = one.getEdit(2);
        expect(result.item === item1).to.be.true;
        expect(Object.isFrozen(result.item)).to.be.true;
    });

    it("maintains deep objects whithin array identical when getting editable", function () {
        let item1 = { uid: 1 };
        let item2 = { uid: 2 };
        let item3 = {
            uid: 3, items: [
                item1, item2
            ]
        };
        one.put(item3);
        let result = one.getEdit(3);
        expect(result.items[0] === item1).to.be.true;
        expect(Object.isFrozen(result.items[0])).to.be.true;
        expect(result.items[1] === item2).to.be.true;
        expect(Object.isFrozen(result.items[1])).to.be.true;
    });

    it("throws error if getting without an item or uid", function () {
        expect(() => {
            one.get();
        }).to.throw(TypeError);
    });

    it("gets an entire array by uid", function () {
        let item1 = { uid: 1 };
        let item2 = { uid: 2 };
        let item3 = { uid: 3 };
        let item4 = { uid: 4, items: [item1, item2] };
        one.put([item1, item2, item3, item4]);
        let result = one.get([1, 2, 4]);
        expect(isArray(result)).to.be.true;
        expect(result.length).to.equal(3);
        expect(result[0].uid).to.equal(1);
        expect(result[1].uid).to.equal(2);
        expect(result[2].uid).to.equal(4);
        expect(result[2].items[0].uid).to.equal(1);
        expect(result[2].items[1].uid).to.equal(2);
    });

    it("gets an entire array by entities", function () {
        let item1 = { uid: 1 };
        let item2 = { uid: 2 };
        let item3 = { uid: 3 };
        let item4 = { uid: 4, items: [item1, item2] };
        one.put([item1, item2, item3, item4]);
        let result = one.get([item1, item2, item4]);
        expect(isArray(result)).to.be.true;
        expect(result.length).to.equal(3);
        expect(result[0].uid).to.equal(1);
        expect(result[1].uid).to.equal(2);
        expect(result[2].uid).to.equal(4);
        expect(result[2].items[0].uid).to.equal(1);
        expect(result[2].items[1].uid).to.equal(2);
    });

    it("gets an array mixed by entity or uid", function () {
        let item1 = { uid: 1 };
        let item2 = { uid: 2 };
        let item3 = { uid: 3 };
        let item4 = { uid: 4, items: [item1, item2] };
        one.put([item1, item2, item3, item4]);
        let result = one.get([1, item2, 4]);
        expect(isArray(result)).to.be.true;
        expect(result.length).to.equal(3);
        expect(result[0].uid).to.equal(1);
        expect(result[1].uid).to.equal(2);
        expect(result[2].uid).to.equal(4);
        expect(result[2].items[0].uid).to.equal(1);
        expect(result[2].items[1].uid).to.equal(2);
    });

    it("gets an entire array but skips non uid array entities", function () {
        let item1 = { uid: 1 };
        let item2 = { uid: 2 };
        let item = { val: "test" };
        one.put([item1, item2, item]);
        let result = one.get([1, 2, item]);
        expect(isArray(result)).to.be.true;
        expect(result.length).to.equal(2);
        expect(result[0].uid).to.equal(1);
        expect(result[1].uid).to.equal(2);
    });

    it('gets with functions', () => {
        let item = {
            uid: 1,
            do: () => { return 3 }
        }
        one.put(item);
        expect(typeof one.get(1).do === 'function').to.be.true;
        expect(one.get(1).do()).to.equal(3);
    })

    it('gets edit with functions', () => {
        let item = {
            uid: 1,
            func: () => { return 3 }
        }
        item["dofunc"] = function () {
            return 5;
        }
        expect(typeof item["dofunc"] === 'function').to.be.true;
        one.put(item);

        let result = one.getEdit(1);
        expect(result === item).to.be.false;
        expect(typeof result.func === 'function').to.be.true;
        expect(result.func()).to.equal(3);

        expect(typeof result['dofunc'] === 'function').to.be.true;
        expect(result['dofunc']()).to.equal(5);
    })

    it('gets edit with functions with new', () => {
        function Test() {
            let uid;
        }
        Test.prototype.uid = 1;
        Test.prototype.func = function () {
            return this.uid;
        }

        let test1 = new Test();
        expect(test1.uid).to.equal(1)
        expect(test1.func()).to.equal(1);

        one.put(test1);
        let result = one.getEdit(1);
        expect(test1 === result).to.be.false;
        expect(typeof result.func === 'function').to.be.true;
        expect(result.uid).to.equal(1);
        expect(result.func()).to.equal(1);
    })

    it('should keep array editable on getEdit', () => {
        let item = {
            uid: 1,
            children: [
                "test", "more"
            ]
        }
        one.put(item);
        let result = one.getEdit(1);
        result.children = result.children.concat(['other']);
        expect(result.children.length).to.equal(3);
        expect(result.children[0]).to.equal('test');
        expect(result.children[1]).to.equal('more');
        expect(result.children[2]).to.equal('other');
    })

    it('should keep function on object', () => {
        class Test {
            uid: number = 1;
            list: Array<String> = [];

            addItems = (items: Array<string>) => {
                this.list = this.list.concat(items);
            }

            test = () => {
                return "aha";
            }
        }
        let test = new Test();
        one.put(test);
        let result = one.get(1)
        expect(typeof result.addItems === 'function').to.be.true;
        expect(Object.isFrozen(result.list)).to.be.true;
        expect(Object.isFrozen(result.getItems)).to.be.true;
        let editResult = one.getEdit(1);
        expect(typeof editResult.addItems === 'function').to.be.true;
        expect(Object.isFrozen(editResult.list)).to.be.false;
        expect(Object.isFrozen(editResult.addItems)).to.be.false;
        expect(editResult.test()).to.equal('aha');
        // new function
        expect(editResult.test === test.test).to.be.false;
    })

    it('should keep object array editable on getEdit', () => {



        class Test {
            uid: number = 1;
            list: Array<String> = [];

            addItems = (items: Array<string>) => {
                this.list = this.list.concat(items);
            }
        }

        let test = new Test();
        expect(test.list.length).to.equal(0);
        test.addItems(['value']);
        expect(test.list.length).to.equal(1);
        expect(Object.isFrozen(test.list)).to.be.false;
        one.put(test);
        let result = one.getEdit(1);
        expect(result).to.not.be.undefined;
        expect(Object.isFrozen(result.list)).to.be.false;
        expect(typeof result.addItems === 'function').to.be.true;
        let listDescriptor = Object.getOwnPropertyDescriptor(result, 'list');
        expect(listDescriptor.writable).to.be.true;
        expect(Object.isFrozen(result.addItems)).to.be.false;
        //result.list = result.list.concat(['test'])
        result.addItems(['test'])
        expect(result.list.length).to.equal(2)
        console.log(result.list)
    })

    it('should clone function ', () => {
        class Test {
            uid: number = 1;
            list: Array<String> = [];

            addItems = (items: Array<string>) => {
                this.list = this.list.concat(items);
            }
        }


    })
});


