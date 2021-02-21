import { New } from "./functions.js";
class UIDGen {
    constructor() {
        this.count = null;
        this.prefix = null;
        return New(UIDGen);
    }
    static construct() {
        this.count = 0;
        this.prefix = "";
        return this;
    }
    generate() {
        return `${this.prefix}:${this.count++}`;
    }
}
export default UIDGen;
