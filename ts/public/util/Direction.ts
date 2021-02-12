import Vector from "./Vector.js";

enum Direction {
	DOWN,
	LEFT,
	RIGHT,
	UP
}

export default Direction;

export function invertDirection(d: Direction) {
	if (d === Direction.DOWN) return Direction.UP;
	if (d === Direction.LEFT) return Direction.RIGHT;
	if (d === Direction.RIGHT) return Direction.LEFT;
	return Direction.DOWN;
}

export function directionToVector(d: Direction) {
	if (d === Direction.DOWN) return new Vector(0, 1);
	if (d === Direction.LEFT) return new Vector(-1, 0);
	if (d === Direction.RIGHT) return new Vector(1, 0);
	return new Vector(0, -1);
}

