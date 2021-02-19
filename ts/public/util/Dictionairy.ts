import { ArrayUtil } from "./ObjectMethods.js";

class Dictionairy<K extends keyof any = keyof any, V = any> {


	protected entries: Dictionairy.Entry<K, V>[] = [];
	protected get existing() {
		return this.entries.filter(e => e.exists)
	}
	protected get deleted() {
		return this.entries.filter(e => !e.exists)
	}
	get length() {
		return this.existing.length;
	}

	set(key: K, value: V) {
		const existing = this.findEntry(key);

		if (existing) {
			existing.value = value;
		} else {
			this.entries.push({ key, value, exists: true });
		}

		return this;
	}

	get(predicate: Dictionairy.Predicate<K, V, this>) {
		return this.findEntry(predicate)?.value;
	}
	has(predicate: Dictionairy.Predicate<K, V, this>) {
		return typeof this.findEntry(predicate) !== "undefined";
	}
	filter(predicate = this.always(), limit = Infinity) {
		const newDict = new Dictionairy<K, V>();
		newDict.entries = ArrayUtil.limit(this.findEntries(predicate), limit);
		return newDict;
	}
	randomValue() {
		return ArrayUtil.randomElement(this.entries)?.value;
	}

	clone() {
		const newDict = new Dictionairy<K, V>();
		newDict.entries = [...this.entries];
		return newDict;
	}

	delete(predicate = this.always(), limit = Infinity) {
		const entries = ArrayUtil.limit(this.findEntries(predicate), limit);
		entries.forEach(e => {
			if (limit === 0) return;
			e.exists = false;
			limit--;
		});
	}
	restore(predicate = this.always(), limit = Infinity) {
		const entries = ArrayUtil.limit(this.findEntries(predicate, this.deleted), limit);
		entries.forEach((e) => {
			const withKeyArr = this.findEntries(e.key, this.entries)
			withKeyArr.forEach((withKey, i, a) => {
				a.splice(i, 1);
			})
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

	protected findEntry(predicate = this.always(), entries = this.existing) {
		if (typeof predicate === "function") {
			return entries.find(e => {
				return predicate(e.value, e.key, this);
			})
		} else {
			return entries.find(e => e.key === predicate);
		}
	}
	protected findEntries(predicate = this.always(), entries = this.existing) {
		let output = [...entries];
		if (typeof predicate === "function") {
			output = [...entries.filter(e => {
				return predicate(e.value, e.key, this);
			})]
		} else {
			output = [...entries.filter(e => e.key === predicate)];
		}
		return output;
	}
	protected fits(entry: Dictionairy.Entry<K, V>, predicate = this.always()) {
		let output = true;
		if (typeof predicate === "function") {
			output = predicate(entry.value, entry.key, this)
		} else {
			output = entry.key === predicate;
		}
		return output;
	}
	protected always() {
		return (() => true) as Dictionairy.Predicate<K, V, this>;
	}

	toObject() {
		let obj: { [k in K]?: V } = {};

		this.existing.forEach(e => {
			obj[e.key] = e.value;
		})

		return obj;
	}

	toArray() {
		return this.existing.map(e => e.value);
	}

	static fromObject<OK extends keyof any, OV>(obj: Record<OK, OV>) {
		const dict = new Dictionairy<OK, OV>();

		for (let i in obj) {
			dict.set(i, obj[i]);
		}
		for (let i of Object.getOwnPropertySymbols(obj)) {
			dict.set(i as unknown as OK, obj[i as unknown as OK] as unknown as OV);
		}

		return dict;
	}
	static fromArray<AV>(arr: AV[]): Dictionairy<number, AV> {
		const dict = new Dictionairy<number, AV>();
		arr.forEach((av, i) => dict.set(i, av));
		return dict;
	}

	keys() {
		return Dictionairy.fromArray(this.entries.map(e => e.key));
	}
	values() {
		return Dictionairy.fromArray(this.entries.map(e => e.value));
	}

	static concat<DK extends keyof any, DV>(...dictionairies: Dictionairy<DK, DV>[]) {
		const output = new Dictionairy<DK, DV>();

		dictionairies.forEach(d => {
			d.entries.forEach(e => {
				output.set(e.key, e.value)
			})
		})
		return output;
	}

	static equals(..._dictionairies: Dictionairy<any, any>[]): boolean {
		const dicts = [..._dictionairies]
		if (dicts.length < 2) return true;

		const first = dicts.shift() as Dictionairy;

		return dicts.every(dict => {
			if (dict.length !== first.length) return false;
			const firstCopy = first.clone();
			const dictCopy = dict.clone();
			while (firstCopy.length > 0) {
				let allSame = true;
				for (let _prop in dictCopy.entries[0]) {
					let prop = _prop as keyof Dictionairy.Entry<keyof any, any>;
					if (dictCopy.entries[0][prop] !== firstCopy.entries[0][prop]) allSame = false;
				}
				if (allSame) dictCopy.entries.shift();
				firstCopy.entries.shift();
			}
			return firstCopy.length === 0 && dictCopy.length === 0;
		})
	}

	forEach(fn: (value: V, key: K, dictionairy: this) => void) {
		this.existing.forEach(e => fn(e.value, e.key, this));
	}
	map<T>(fn: (value: V, key: K, dictionairy: this) => T) {
		const output = new Dictionairy<K, T>();
		this.existing.forEach(e => output.set(e.key, fn(e.value, e.key, this)));
	}

	reduce<R>(fn: (accumulatedResult: R, currentValue: V, key: K, dictionairy: this) => R, startingValue: R) {
		let val = startingValue;
		this.existing.forEach((entry, i) => {

			val = fn(val, entry.value, entry.key, this);
		})
		return val;
	}
	[Symbol.iterator](): Iterator<V> {
		let i = -1;
		let dict = this;
		return {
			next() {

				i++;
				return { value: dict.entries[i]?.value, done: i >= dict.entries.length }
			}
		}
	}
	items() {
		return Dictionairy.fromArray(this.existing.map(e => ({ key: e.key, value: e.value })));
	}

	sort(fn: (value: V, key: K, dictionairy: this) => number) {
		const dict = new Dictionairy<K, V>();
		dict.entries = this.existing.sort((a, b) => fn(a.value, a.key, this) - fn(b.value, b.key, this))
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

namespace Dictionairy {
	export type Entry<K extends keyof any, V, E = boolean> = {
		key: K,
		value: V,
		exists: E;
	};
	export type Predicate<K extends keyof any, V, D = Dictionairy<K, V>> = K | Dictionairy.SearchFunction<K, V, D>;
	export type SearchFunction<K extends keyof any, V, D> = ((value: V, key: K, dictionairy: D) => boolean);
}

export default Dictionairy;