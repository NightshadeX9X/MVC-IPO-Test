import { ArrayUtil } from "./ObjectMethods.js";
class Dictionairy {
    constructor() {
        this.entries = [];
    }
    get existing() {
        return this.entries.filter(e => e.exists);
    }
    get deleted() {
        return this.entries.filter(e => !e.exists);
    }
    get length() {
        return this.existing.length;
    }
    set(key, value) {
        const existing = this.findEntry(key);
        if (existing) {
            existing.value = value;
        }
        else {
            this.entries.push({ key, value, exists: true });
        }
        return this;
    }
    get(predicate) {
        return this.findEntry(predicate)?.value;
    }
    has(predicate) {
        return typeof this.findEntry(predicate) !== "undefined";
    }
    filter(predicate = this.always(), limit = Infinity) {
        const newDict = new Dictionairy();
        newDict.entries = ArrayUtil.limit(this.findEntries(predicate), limit);
        return newDict;
    }
    randomValue() {
        return ArrayUtil.randomElement(this.entries)?.value;
    }
    clone() {
        const newDict = new Dictionairy();
        newDict.entries = [...this.entries];
        return newDict;
    }
    delete(predicate = this.always(), limit = Infinity) {
        const entries = ArrayUtil.limit(this.findEntries(predicate), limit);
        entries.forEach(e => {
            if (limit === 0)
                return;
            e.exists = false;
            limit--;
        });
    }
    restore(predicate = this.always(), limit = Infinity) {
        const entries = ArrayUtil.limit(this.findEntries(predicate, this.deleted), limit);
        entries.forEach((e) => {
            const withKeyArr = this.findEntries(e.key, this.entries);
            withKeyArr.forEach((withKey, i, a) => {
                a.splice(i, 1);
            });
            e.exists = true;
        });
        return this;
    }
    purge(predicate = this.always(), limit = Infinity) {
        let purged = 0;
        for (let i = 0; i < this.entries.length; i++) {
            const entry = this.entries[i];
            if (this.fits(entry, predicate) && purged < limit) {
                this.entries.splice(i, 1);
                purged++;
            }
        }
        return this;
    }
    purgeDeleted() {
        this.entries = this.existing;
        return this;
    }
    findEntry(predicate = this.always(), entries = this.existing) {
        if (typeof predicate === "function") {
            return entries.find(e => {
                return predicate(e.value, e.key, this);
            });
        }
        else {
            return entries.find(e => e.key === predicate);
        }
    }
    findEntries(predicate = this.always(), entries = this.existing) {
        let output = [...entries];
        if (typeof predicate === "function") {
            output = [...entries.filter(e => {
                    return predicate(e.value, e.key, this);
                })];
        }
        else {
            output = [...entries.filter(e => e.key === predicate)];
        }
        return output;
    }
    fits(entry, predicate = this.always()) {
        let output = true;
        if (typeof predicate === "function") {
            output = predicate(entry.value, entry.key, this);
        }
        else {
            output = entry.key === predicate;
        }
        return output;
    }
    always() {
        return (() => true);
    }
    toObject() {
        let obj = {};
        this.existing.forEach(e => {
            obj[e.key] = e.value;
        });
        return obj;
    }
    toArray() {
        return this.existing.map(e => e.value);
    }
    static fromObject(obj) {
        const dict = new Dictionairy();
        for (let i in obj) {
            dict.set(i, obj[i]);
        }
        for (let i of Object.getOwnPropertySymbols(obj)) {
            dict.set(i, obj[i]);
        }
        return dict;
    }
    static fromArray(arr) {
        const dict = new Dictionairy();
        arr.forEach((av, i) => dict.set(i, av));
        return dict;
    }
    keys() {
        return Dictionairy.fromArray(this.entries.map(e => e.key));
    }
    values() {
        return Dictionairy.fromArray(this.entries.map(e => e.value));
    }
    static concat(...dictionairies) {
        const output = new Dictionairy();
        dictionairies.forEach(d => {
            d.entries.forEach(e => {
                output.set(e.key, e.value);
            });
        });
        return output;
    }
    static equals(..._dictionairies) {
        const dicts = [..._dictionairies];
        if (dicts.length < 2)
            return true;
        const first = dicts.shift();
        return dicts.every(dict => {
            if (dict.length !== first.length)
                return false;
            const firstCopy = first.clone();
            const dictCopy = dict.clone();
            while (firstCopy.length > 0) {
                let allSame = true;
                for (let _prop in dictCopy.entries[0]) {
                    let prop = _prop;
                    if (dictCopy.entries[0][prop] !== firstCopy.entries[0][prop])
                        allSame = false;
                }
                if (allSame)
                    dictCopy.entries.shift();
                firstCopy.entries.shift();
            }
            return firstCopy.length === 0 && dictCopy.length === 0;
        });
    }
    forEach(fn) {
        this.existing.forEach(e => fn(e.value, e.key, this));
    }
    map(fn) {
        const output = new Dictionairy();
        this.existing.forEach(e => output.set(e.key, fn(e.value, e.key, this)));
    }
    reduce(fn, startingValue) {
        let val = startingValue;
        this.existing.forEach((entry, i) => {
            val = fn(val, entry.value, entry.key, this);
        });
        return val;
    }
    [Symbol.iterator]() {
        let i = -1;
        let dict = this;
        return {
            next() {
                i++;
                return { value: dict.entries[i]?.value, done: i >= dict.entries.length };
            }
        };
    }
    items() {
        return Dictionairy.fromArray(this.existing.map(e => ({ key: e.key, value: e.value })));
    }
    sort(fn) {
        const dict = new Dictionairy();
        dict.entries = this.existing.sort((a, b) => fn(a.value, a.key, this) - fn(b.value, b.key, this));
        return dict;
    }
    get first() {
        return this.existing[0]?.value;
    }
    get last() {
        return this.existing[this.existing.length - 1]?.value;
    }
    get firstKey() {
        return this.existing[0]?.key;
    }
    get lastKey() {
        return this.existing[this.existing.length - 1]?.key;
    }
}
export default Dictionairy;
