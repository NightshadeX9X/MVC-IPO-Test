import { New } from "./functions.js";

class UIDGen {
	private count = 0;

	constructor(public prefix = "") {

	}
	generate() {
		return `${this.prefix}:${this.count++}`;
	}
}

export default UIDGen;