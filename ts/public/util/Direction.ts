import { New, random } from "./functions.js";
import Vector from "./Vector.js";

enum Direction {
	DOWN,
	LEFT,
	RIGHT,
	UP
}

namespace Direction {
	export function invert(d: Direction) {
		if (d === Direction.DOWN) return Direction.UP;
		if (d === Direction.LEFT) return Direction.RIGHT;
		if (d === Direction.RIGHT) return Direction.LEFT;
		return Direction.DOWN;
	}
	export function toVector(d: Direction) {
		if (d === Direction.DOWN) return new Vector(0, 1);
		if (d === Direction.LEFT) return new Vector(-1, 0);
		if (d === Direction.RIGHT) return new Vector(1, 0);
		return new Vector(0, -1);
	}
	export function fromVector(v: Vector) {
		let horizontal: Direction;
		let vertical: Direction;
		if (v.x < 0) horizontal = Direction.LEFT;
		else horizontal = Direction.RIGHT;
		if (v.y < 0) vertical = Direction.UP;
		else vertical = Direction.DOWN;

		const abs = v.map(Math.abs);
		if (abs.x > abs.y) return horizontal;
		else return vertical;
	}
	export function routeTo(v: Vector) {
		let horizontal: Direction;
		let vertical: Direction;
		if (v.x < 0) horizontal = Direction.LEFT;
		else horizontal = Direction.RIGHT;
		if (v.y < 0) vertical = Direction.UP;
		else vertical = Direction.DOWN;

		const abs = v.map(Math.abs);
		if (abs.x > abs.y) return [horizontal, vertical, Direction.invert(horizontal), Direction.invert(vertical)];
		else return [vertical, horizontal, Direction.invert(vertical), Direction.invert(horizontal)];
	}
	export function getRandom() {
		return random(0, 3) as Direction;
	}
	export type AsString = "DOWN" | "LEFT" | "UP" | "RIGHT";
}

export default Direction;