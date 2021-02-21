import { New } from "./functions.js";

class UIDGen {
	private count: number = null as any;
	prefix: string = null as any;

	constructor() {
		return New(UIDGen);
	}

	static construct(this: UIDGen) {
		this.count = 0;
		this.prefix = "";

		return this;
	}

	generate() {
		return `${this.prefix}:${this.count++}`;
	}
}

export default UIDGen;