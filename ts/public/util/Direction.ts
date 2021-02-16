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
	export type AsString = "DOWN" | "LEFT" | "UP" | "RIGHT";
}

export default Direction;
