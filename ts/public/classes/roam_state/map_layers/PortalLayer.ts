import Camera from "../Camera.js";
import Input from "../../Input.js";
import Vector from "../../Vector.js";
import GameMap from "../GameMap.js";
import GameMapLayer from "../GameMapLayer.js";

export class PortalLayer extends GameMapLayer<{ to: string } | null> {
	zIndex = -3;
	getData() {
		if (!this.gameMap.json?.layers?.portals) return [];
		const toReturn: ({ to: string } | null)[][] = [];
		const portalData = this.gameMap.json.layers.portals;
		const mapSize = Vector.fromString(this.gameMap.json.sizeInTiles);
		for (let y = 0; y <= mapSize.y; y++) {
			if (!Array.isArray(toReturn[y])) toReturn[y] = [];
			for (let x = 0; x <= mapSize.x; x++) {
				toReturn[y][x] = null;
			}
		}
		if (!portalData) return toReturn;
		portalData.forEach(pd => {
			const [pos1, pos2] = pd.range.split("-").map(p => Vector.fromString(p as any));
			for (let y = pos1.y; y <= pos2.y; y++) {
				for (let x = pos1.x; x <= pos2.x; x++) {
					toReturn[y][x] = pd.value;
				}
			}
		});
		console.log(toReturn);
		return toReturn;
	}
	async preload() {

	}
	init(): void {
	}
	update(input: Input): void {

	}
	data = this.getData();
	render(camera: Camera): void {

	}
	constructor(public gameMap: GameMap) {
		super(gameMap);
	}
}