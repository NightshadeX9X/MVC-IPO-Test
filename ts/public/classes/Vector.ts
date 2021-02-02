export default class Vector implements Vector {
	constructor(public x = 0, public y = x) {

	}
	private getVectorFromArgs(a: number | Vector, b?: number) {
		const vector = typeof b === "number"
			? (new Vector(a as number, b))
			: (typeof a === "number" ? new Vector(a) : a);

		return vector;
	}
	private convertTo1if0() {
		const n = new Vector(this.x, this.y);
		if (n.x === 0) n.x = 1;
		if (n.y === 0) n.y = 1;
		return n;
	}

	sum(a: number | Vector, b?: number) {
		const o = this.getVectorFromArgs(a, b);
		return new Vector(this.x + o.x, this.y + o.y);
	}
	diff(a: number | Vector, b?: number) {
		const o = this.getVectorFromArgs(a, b);
		return new Vector(this.x - o.x, this.y - o.y);
	}
	prod(a: number | Vector, b?: number) {
		const o = this.getVectorFromArgs(a, b);
		return new Vector(this.x * o.x, this.y * o.y);
	}
	quo(a: number | Vector, b?: number) {
		const o = this.getVectorFromArgs(a, b).convertTo1if0();
		return new Vector(this.x / o.x, this.y / o.y);
	}

	add(a: number | Vector, b?: number) {
		const res = this.sum(a, b);
		this.x = res.x;
		this.y = res.y;
	}
	sub(a: number | Vector, b?: number) {
		const res = this.diff(a, b);
		this.x = res.x;
		this.y = res.y;
	}
	mult(a: number | Vector, b?: number) {
		const res = this.prod(a, b);
		this.x = res.x;
		this.y = res.y;
	}
	div(a: number | Vector, b?: number) {
		const res = this.quo(a, b);
		this.x = res.x;
		this.y = res.y;
	}

	map(fn: (n: number) => number) {
		this.x = fn(this.x);
		this.y = fn(this.y);
	}
	mapReturn(fn: (n: number) => number) {
		let vec = new Vector();
		vec.x = fn(this.x);
		vec.y = fn(this.y);
		return vec;
	}

	equals(a: number | Vector, b?: number) {
		const o = this.getVectorFromArgs(a, b);
		return this.x === o.x && this.y === o.y;
	}
	lessThan(a: number | Vector, b?: number) {
		const o = this.getVectorFromArgs(a, b);
		return this.x < o.x && this.y < o.y;
	}
	lessThanOrEqualTo(a: number | Vector, b?: number) {
		const o = this.getVectorFromArgs(a, b);
		return this.x <= o.x && this.y <= o.y;
	}
	greaterThan(a: number | Vector, b?: number) {
		const o = this.getVectorFromArgs(a, b);
		return this.x > o.x && this.y > o.y;
	}
	greaterThanOrEqualTo(a: number | Vector, b?: number) {
		const o = this.getVectorFromArgs(a, b);
		return this.x >= o.x && this.y >= o.y;
	}

	static from(n: { x: number, y: number }) {
		return new Vector(n.x, n.y);
	}

	distFrom(a: number | Vector, b?: number) {
		const o = this.getVectorFromArgs(a, b);
		const xDiffSq = (this.x - o.x) ^ 2;
		const yDiffSq = (this.y - o.y) ^ 2;
		const dist = Math.sqrt(xDiffSq + yDiffSq);

		return dist;
	}
	static fromString(string: string) {
		const [x, y] = string.split("x").map(Number);
		return new Vector(x, y)
	}

	rangeTo(other: Vector) {
		let inRange: Vector[] = [];
		for (let x = this.x; x < other.x; x++) {
			for (let y = this.y; y < other.y; y++) {
				inRange.push(new Vector(x, y));
			}
		}
		return inRange;
	}
}
