import Camera from "../Camera.js";
import GameMap from "../GameMap.js";
import GameMapLayer from "../GameMapLayer.js";
import Input from "../Input.js";
import Vector from "../Vector.js";

export class WallLayer extends GameMapLayer<boolean> {
	zIndex = -1;
	getData() {
		if (!this.gameMap.json) return [];
		const toReturn: boolean[][] = [];
		const wallData = this.gameMap.json.layers.walls;
		const mapSize = Vector.fromString(this.gameMap.json.sizeInTiles);
		for (let y = 0; y <= mapSize.y; y++) {
			if (!Array.isArray(toReturn[y])) toReturn[y] = [];
			for (let x = 0; x <= mapSize.x; x++) {
				toReturn[y][x] = false;
			}
		}
		if (!wallData) return toReturn;
		wallData.forEach(wd => {
			const [pos1, pos2] = wd.range.split("-").map(p => Vector.fromString(p as any));

			for (let y = pos1.y; y <= pos2.y; y++) {
				for (let x = pos1.x; x <= pos2.x; x++) {
					toReturn[y][x] = wd.value;
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
	drawn: Vector[] = [];
	render(camera: Camera): void {
		const data = this.getData();
		const coords = camera.convertCoords(new Vector)
		camera.ctx.drawImage(this.cnv, coords.x, coords.y);
	}
	constructor(public gameMap: GameMap) {
		super(gameMap);
	}
}