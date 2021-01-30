import Camera from "../Camera.js";
import GameMap from "../GameMap.js";
import GameMapLayer from "../GameMapLayer.js";
import Input from "../Input.js";
import Loader from "../Loader.js";
import Vector from "../Vector.js";

export class GrassLayer extends GameMapLayer<{ table: string, image?: GrassImage } | null> {
	private images = new Map<GrassImage, HTMLImageElement>();
	constructor(gameMap: GameMap) {
		super(gameMap);
		console.log("new grasslayer")
	}
	async preload(loader: Loader) {
		const promises = [
			loader.loadImage(`/assets/images/map_objects/grass.png`)
		];
		const [regular] = await Promise.all(promises);
		this.images.set('regular', regular);

	}
	zIndex = 0;
	getData() {
		if (!this.gameMap.json) return [];
		const toReturn: ({ table: string, image?: GrassImage } | null)[][] = [];
		const grassData = this.gameMap.json.layers.grass;
		const mapSize = Vector.fromString(this.gameMap.json.sizeInTiles);
		for (let y = 0; y < mapSize.y; y++) {
			if (!Array.isArray(toReturn[y])) toReturn[y] = [];
			for (let x = 0; x < mapSize.x; x++) {
				toReturn[y][x] = null;
			}
		}
		if (!grassData) return toReturn;
		grassData.forEach(wd => {
			if (!wd) return;
			wd.value.image ||= "regular";
			const [pos1, pos2] = wd.range.split("-").map(p => Vector.fromString(p as any));

			for (let y = pos1.y; y <= pos2.y; y++) {
				for (let x = pos1.x; x <= pos2.x; x++) {
					toReturn[y][x] = wd.value;
				}
			}
		});
		return toReturn;
	}
	init(): void {
	}
	update(input: Input): void {

	}
	data = this.getData();
	render(camera: Camera): void {
		this.data.forEach((row, y) => {
			if (!row) return;
			row.forEach((tile, x) => {
				if (!tile?.image) return;
				const coords = camera.convertCoords(new Vector(x, y).prod(this.gameMap.roamState.tileSize));
				if (tile.image !== "transparent") {
					const image = this.images.get(tile.image);
					if (!image) return;
					camera.ctx.drawImage(image, coords.x, coords.y, this.gameMap.roamState.tileSize.x, this.gameMap.roamState.tileSize.y);
				}
			});
		})
	}
}

export type GrassImage = "regular" | "transparent"