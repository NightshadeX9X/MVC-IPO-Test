export default class Vector {
	constructor(public x = 0, public y = x) { }

	add(n: Vector | number) {
		let v = n instanceof Vector ? n : { x: n, y: n };

		return new Vector(this.x + v.x, this.y + v.y);
	}

	subtract(n: Vector | number) {
		let v = n instanceof Vector ? n : { x: n, y: n };

		return new Vector(this.x - v.x, this.y - v.y);
	}

	multiply(n: Vector | number) {
		let v = n instanceof Vector ? n : { x: n, y: n };

		return new Vector(this.x * v.x, this.y * v.y);
	}

	divide(n: Vector | number) {
		let v = n instanceof Vector ? n : { x: n, y: n };
		let x = v.x === 0 ? 0 : this.x / v.x;
		let y = v.y === 0 ? 0 : this.y / v.y;
		return new Vector(x, y);
	}

	floor() {
		return new Vector(Math.floor(this.x), Math.floor(this.y))
	}
	round() {
		return new Vector(Math.round(this.x), Math.round(this.y))
	}

	abs() {
		return new Vector(Math.abs(this.x), Math.abs(this.y))
	}

	equals(ov: Vector) {
		return ov.x === this.x && ov.y === this.y;
	}
}