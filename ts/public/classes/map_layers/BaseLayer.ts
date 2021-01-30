import Camera from "../Camera.js";
import GameMap from "../GameMap.js";
import GameMapLayer from "../GameMapLayer.js";
import Input from "../Input.js";
import Loader from "../Loader.js";
import Vector from "../Vector.js";

export class BaseLayer extends GameMapLayer<boolean> {
	zIndex = -2;
	getData() {
		let data: boolean[][] = [];
		for (let y = 0; y <= this.gameMap.size.y; y++) {
			if (!data[y]) data[y] = [];
			for (let x = 0; x <= this.gameMap.size.x; x++) {
				data[y][x] = true;
			}
		}
		return data;
	}
	async preload(loader: Loader) {
		const promises = [
			loader.loadImage(`/assets/images/maps/${this.gameMap.name}.png`)
		];

		const [image]
			= await Promise.all(promises) as
			[HTMLImageElement];
		this.gameMap.image = image;
	}
	data = this.getData();
	init(): void {
	}
	update(input: Input): void {
	}
	render(camera: Camera): void {
		if (!this.gameMap.image) return;
		this.ctx.drawImage(this.gameMap.image, 0, 0)
		const coords = camera.convertCoords(new Vector);
		camera.ctx.drawImage(this.cnv, coords.x, coords.y);

	}
	constructor(public gameMap: GameMap) {
		super(gameMap);
	}
}