export default class Vector {
	constructor(public x: number, public y: number) { }

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
}