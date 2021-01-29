import Entity from "../Entity.js";
import GameMap from "./GameMap.js";
import Input from "./Input.js";
import Vector from "./Vector.js";

export default abstract class GameMapLayer<T = any> implements Entity {
	abstract zIndex: number;
	constructor(public gameMap: GameMap) {

	}
	abstract get data(): T[][];
	abstract preload(): Promise<void>;
	abstract init(): void;
	abstract update(input: Input): void;
	abstract render(ctx: CanvasRenderingContext2D): void;
}

export class GameMapWallLayer extends GameMapLayer<boolean> {
	zIndex = 0;
	get data() {
		if (!this.gameMap.json?.layers.walls) return [];
		const toReturn: boolean[][] = [];
		const wallData = this.gameMap.json.layers.walls;
		const mapSize = Vector.fromString(this.gameMap.json.sizeInTiles);
		for (let y = 0; y < mapSize.y; y++) {
			if (!Array.isArray(toReturn[y])) toReturn[y] = [];
			for (let x = 0; x < mapSize.x; x++) {
				toReturn[y][x] = false;
			}
		}
		wallData.forEach(wd => {
			const [pos1, pos2] = wd.range.split("-").map(p => Vector.from(p as any));


			for (let y = pos1.y; y < pos2.y; y++) {
				for (let x = pos1.x; x < pos2.x; x++) {
					toReturn[y][x] = true;
				}
			}
		});
		return toReturn;
	}
	async preload() {

	}
	init(): void {

	}
	update(input: Input): void {

	}
	render(ctx: CanvasRenderingContext2D): void {

	}
	constructor(public gameMap: GameMap) {
		super(gameMap);
	}
}


/* export class GameMapGrassLayer extends GameMapLayer<{ tableId: string }> {
	zIndex = 0;
	get data() {
		return {tableId: ""}
	}
	async preload() {

	}
	init(): void {

	}
	update(input: Input): void {

	}
	render(ctx: CanvasRenderingContext2D): void {

	}
	constructor(public gameMap: GameMap) {
		super(gameMap);
	}
}
 */

