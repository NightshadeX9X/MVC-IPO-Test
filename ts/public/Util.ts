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

export function generate2DArray<T>(rows: number, columns: number, defaultVal: T, ranges: { pos1: Vector, pos2: Vector, value: T }[]): T[][] {
	const arr: T[][] = [];

	for (let y = 0; y < rows; y++) {
		arr[y] = [];

		for (let x = 0; x < columns; x++) {
			arr[y][x] = defaultVal;
		}
	}

	ranges.forEach(range => {
		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < columns; x++) {
				if (x >= range.pos1.x && x <= range.pos2.x && y >= range.pos1.y && y <= range.pos2.y)
					arr[y][x] = range.value;

			}
		}
	})


	return arr;

}