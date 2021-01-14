import Vector from "./classes/Vector.js";

export enum Direction {
	LEFT,
	UP,
	RIGHT,
	DOWN
}
export function directionToVector(d: Direction) {
	if (d === Direction.LEFT) return new Vector(-1, 0);
	if (d === Direction.UP) return new Vector(0, -1);
	if (d === Direction.RIGHT) return new Vector(1, 0);
	if (d === Direction.DOWN) return new Vector(0, 1);
	return new Vector()
}