export default class Vector implements Vector {
	constructor(public x = 0, public y = x) { }

	private getVectorFromArgs(a: number | Vector, b?: number) {
		const vector = typeof b === "number"
			? (new Vector(a as number, b))
			: (typeof a === "number" ? new Vector(a) : a);

		return vector;
	}

	// OPERATION BY RETURN
	sum(a: number): Vector;
	sum(a: number, b: number): Vector;
	sum(a: Vector): Vector;
	sum(a: number | Vector, b?: number) {
		const vector = this.getVectorFromArgs(a, b)
		return new Vector(this.x + vector.x, this.y + vector.y);
	}

	diff(a: number): Vector;
	diff(a: number, b: number): Vector;
	diff(a: Vector): Vector;
	diff(a: number | Vector, b?: number) {
		const vector = this.getVectorFromArgs(a, b)
		return new Vector(this.x - vector.x, this.y - vector.y);
	}

	prod(a: number): Vector;
	prod(a: number, b: number): Vector;
	prod(a: Vector): Vector;
	prod(a: number | Vector, b?: number) {
		const vector = this.getVectorFromArgs(a, b)
		return new Vector(this.x * vector.x, this.y * vector.y);
	}

	quo(a: number): Vector;
	quo(a: number, b: number): Vector;
	quo(a: Vector): Vector;
	quo(a: number | Vector, b?: number) {
		const vector = this.getVectorFromArgs(a, b)
		let x = vector.x || 1;
		let y = vector.y || 1;
		return new Vector(this.x / x, this.y / y);
	}

	// ------ COMPARISON
	equals(a: number): boolean;
	equals(a: number, b: number): boolean;
	equals(a: Vector): boolean;
	equals(a: number | Vector, b?: number) {
		const vector = this.getVectorFromArgs(a, b)
		return this.x === vector.x && this.y === vector.y;
	}

	lessThan(a: number): boolean;
	lessThan(a: number, b: number): boolean;
	lessThan(a: Vector): boolean;
	lessThan(a: number | Vector, b?: number) {
		const vector = this.getVectorFromArgs(a, b)
		return this.x < vector.x && this.y < vector.y;
	}

	lessThanOrEqualTo(a: number): boolean;
	lessThanOrEqualTo(a: number, b: number): boolean;
	lessThanOrEqualTo(a: Vector): boolean;
	lessThanOrEqualTo(a: number | Vector, b?: number) {
		const vector = this.getVectorFromArgs(a, b)
		return this.x <= vector.x && this.y <= vector.y;
	}

	greaterThan(a: number): boolean;
	greaterThan(a: number, b: number): boolean;
	greaterThan(a: Vector): boolean;
	greaterThan(a: number | Vector, b?: number) {
		const vector = this.getVectorFromArgs(a, b)
		return this.x > vector.x && this.y > vector.y;
	}

	greaterThanOrEqualTo(a: number): boolean;
	greaterThanOrEqualTo(a: number, b: number): boolean;
	greaterThanOrEqualTo(a: Vector): boolean;
	greaterThanOrEqualTo(a: number | Vector, b?: number) {
		const vector = this.getVectorFromArgs(a, b)
		return this.x >= vector.x && this.y >= vector.y;
	}

	// ------ OTHER


	distFrom(a: number): number;
	distFrom(a: number, b: number): number;
	distFrom(a: Vector): number;
	distFrom(a: number | Vector, b?: number) {
		const vector = this.getVectorFromArgs(a, b);
		const xDiffSq = (this.x - vector.x) ** 2;
		const yDiffSq = (this.y - vector.y) ** 2;
		const dist = Math.sqrt(xDiffSq + yDiffSq);

		return dist;
	}

	static from(n: { x: number, y: number }) {
		return new Vector(n.x, n.y);
	}
	static fromString(string: `${number}x${number}`) {
		const [x, y] = string.split("x").map(Number);
		return new Vector(x, y)
	}

	rangeTo(a: number): Vector[];
	rangeTo(a: number, b: number): Vector[];
	rangeTo(a: Vector): Vector[];
	rangeTo(a: number | Vector, b?: number) {
		const vector = this.getVectorFromArgs(a, b);
		let inRange: Vector[] = [];
		for (let x = this.x; x < vector.x; x++) {
			for (let y = this.y; y < vector.y; y++) {
				inRange.push(new Vector(x, y));
			}
		}
		return inRange;
	}

	toString() {
		return `${this.x}x${this.y}` as const
	}
}