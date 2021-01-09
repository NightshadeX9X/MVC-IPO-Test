export default class Vector {
	constructor(public x = 0, public y = x) {

	}

	public static from(n: [number, number] | { x: number, y: number }) {
		if (Array.isArray(n)) {
			return new Vector(n[0], n[1])
		} else return new Vector(n.x, n.y);
	}

	add(o: Vector | number) {
		const v = o instanceof Vector ? o : new Vector(o);

		return new Vector(this.x + v.x, this.y + v.y)
	}
	subtract(o: Vector | number) {
		const v = o instanceof Vector ? o : new Vector(o);

		return new Vector(this.x - v.x, this.y - v.y)
	}
	multiply(o: Vector | number) {
		const v = o instanceof Vector ? o : new Vector(o);

		return new Vector(this.x * v.x, this.y * v.y)
	}
	divide(o: Vector | number) {
		const v = o instanceof Vector ? o : new Vector(o);
		const x = v.x === 0 ? 0 : this.x / v.x;
		const y = v.y === 0 ? 0 : this.y / v.y;

		return new Vector(x, y)
	}

	map(fn: ((n: number) => number) | (() => number)) {
		return new Vector(fn(this.x), fn(this.y));
	}

	equals(ov: Vector) {
		return this.x === ov.x && this.y === ov.y;
	}
}