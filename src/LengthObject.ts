export default class LengthObject {
    length = 0;
    constructor() {
        Object.defineProperty(this, "length", {
            value: 0,
            enumerable: false,
            writable: true
        });
    }
}