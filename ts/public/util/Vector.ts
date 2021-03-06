import { New } from "./functions.js";

interface Vector {
	x: number;
	y: number;
}
class Vector implements Vector {
	constructor(public x = 0, public y = x) {

	}

	private getVectorFromArgs(a: number | Vector, b?: number) {
		const vector = typeof b === "number"
			? (new Vector(a as number, b))
			: (typeof a === "number" ? new Vector(a) : a);

		return vector;
	}

	// OPERATION BY RETURN
	public sum(a: number): Vector;
	public sum(a: number, b: number): Vector;
	public sum(a: Vector): Vector;
	public sum(a: number | Vector, b?: number) {
		const vector = this.getVectorFromArgs(a, b)
		return new Vector(this.x + vector.x, this.y + vector.y);
	}

	public diff(a: number): Vector;
	public diff(a: number, b: number): Vector;
	public diff(a: Vector): Vector;
	public diff(a: number | Vector, b?: number) {
		const vector = this.getVectorFromArgs(a, b)
		return new Vector(this.x - vector.x, this.y - vector.y);
	}

	public prod(a: number): Vector;
	public prod(a: number, b: number): Vector;
	public prod(a: Vector): Vector;
	public prod(a: number | Vector, b?: number) {
		const vector = this.getVectorFromArgs(a, b)
		return new Vector(this.x * vector.x, this.y * vector.y);
	}

	public quo(a: number): Vector;
	public quo(a: number, b: number): Vector;
	public quo(a: Vector): Vector;
	public quo(a: number | Vector, b?: number) {
		const vector = this.getVectorFromArgs(a, b)
		let x = vector.x || 1;
		let y = vector.y || 1;
		return new Vector(this.x / x, this.y / y);
	}

	// ------ OPERATION BY MODIFICATION
	public add(a: number): void;
	public add(a: number, b: number): void;
	public add(a: Vector): void;
	public add(a: number | Vector, b?: number) {
		const vector = this.getVectorFromArgs(a, b);
		const res = this.sum(vector);
		this.x = res.x;
		this.y = res.y;
	}

	public sub(a: number): void;
	public sub(a: number, b: number): void;
	public sub(a: Vector): void;
	public sub(a: number | Vector, b?: number) {
		const vector = this.getVectorFromArgs(a, b);
		const res = this.diff(vector);
		this.x = res.x;
		this.y = res.y;
	}

	public mult(a: number): void;
	public mult(a: number, b: number): void;
	public mult(a: Vector): void;
	public mult(a: number | Vector, b?: number) {
		const vector = this.getVectorFromArgs(a, b);
		const res = this.prod(vector);
		this.x = res.x;
		this.y = res.y;
	}

	public div(a: number): void;
	public div(a: number, b: number): void;
	public div(a: Vector): void;
	public div(a: number | Vector, b?: number) {
		const vector = this.getVectorFromArgs(a, b);
		const res = this.quo(vector);
		this.x = res.x;
		this.y = res.y;
	}
	// ------ COMPARISON
	public equals(a: number): boolean;
	public equals(a: number, b: number): boolean;
	public equals(a: Vector): boolean;
	public equals(a: number | Vector, b?: number) {
		const vector = this.getVectorFromArgs(a, b)
		return this.x === vector.x && this.y === vector.y;
	}

	public lessThan(a: number): boolean;
	public lessThan(a: number, b: number): boolean;
	public lessThan(a: Vector): boolean;
	public lessThan(a: number | Vector, b?: number) {
		const vector = this.getVectorFromArgs(a, b)
		return this.x < vector.x && this.y < vector.y;
	}

	public lessThanOrEqualTo(a: number): boolean;
	public lessThanOrEqualTo(a: number, b: number): boolean;
	public lessThanOrEqualTo(a: Vector): boolean;
	public lessThanOrEqualTo(a: number | Vector, b?: number) {
		const vector = this.getVectorFromArgs(a, b)
		return this.x <= vector.x && this.y <= vector.y;
	}

	public greaterThan(a: number): boolean;
	public greaterThan(a: number, b: number): boolean;
	public greaterThan(a: Vector): boolean;
	public greaterThan(a: number | Vector, b?: number) {
		const vector = this.getVectorFromArgs(a, b)
		return this.x > vector.x && this.y > vector.y;
	}

	public greaterThanOrEqualTo(a: number): boolean;
	public greaterThanOrEqualTo(a: number, b: number): boolean;
	public greaterThanOrEqualTo(a: Vector): boolean;
	public greaterThanOrEqualTo(a: number | Vector, b?: number) {
		const vector = this.getVectorFromArgs(a, b)
		return this.x >= vector.x && this.y >= vector.y;
	}

	// ------ OTHER


	public distFrom(a: number): number;
	public distFrom(a: number, b: number): number;
	public distFrom(a: Vector): number;
	public distFrom(a: number | Vector, b?: number) {
		const vector = this.getVectorFromArgs(a, b);
		const xDiffSq = (this.x - vector.x) ** 2;
		const yDiffSq = (this.y - vector.y) ** 2;
		const dist = Math.sqrt(xDiffSq + yDiffSq);

		return dist;
	}

	public static from(n: { x: number, y: number }) {
		return new Vector(n.x, n.y);
	}
	public static fromString(string: Vector.AsString) {
		const [x, y] = string.split("x").map(Number);
		return new Vector(x, y)
	}

	public rangeTo(a: number): Vector[];
	public rangeTo(a: number, b: number): Vector[];
	public rangeTo(a: Vector): Vector[];
	public rangeTo(a: number | Vector, b?: number) {
		const vector = this.getVectorFromArgs(a, b);
		let inRange: Vector[] = [];
		for (let x = this.x; x < vector.x; x++) {
			for (let y = this.y; y < vector.y; y++) {
				inRange.push(new Vector(x, y));
			}
		}
		return inRange;
	}

	public map(fn: (n: number) => number) {
		const vec = new Vector(fn(this.x), fn(this.y));
		return vec;
	}

	public set(a: number): void;
	public set(a: number, b: number): void;
	public set(a: Vector): void;
	public set(a: number | Vector, b?: number) {
		const vector = this.getVectorFromArgs(a, b)
		this.x = vector.x;
		this.y = vector.y;
	}

	public toString() {
		return `${this.x}x${this.y}` as Vector.AsString;
	}

	public static fromStringRange(strRange: Vector.AsStringRange) {
		const arr = strRange.split("-").map(str => Vector.fromString(str as Vector.AsString)) as [Vector, Vector];
		return arr;
	}
}

namespace Vector {
	export type AsString = `${number}x${number}`;
	export type AsStringRange = `${AsString}-${AsString}`;
}

export default Vector;