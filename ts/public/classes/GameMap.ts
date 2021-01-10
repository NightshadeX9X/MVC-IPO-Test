import { Entity, GameMapJSON } from "../Util.js";
import Controller from "./Controller.js";
import Loader from "./Loader.js";
import RoamState from "./states/RoamState.js";
import Vector from "./Vector.js";

export class GameMap implements Entity {
	public data: GameMapJSON.Pure.Data | null = null;
	public image: HTMLImageElement | null = null;
	constructor(public roamState: RoamState, public jsonFileUrl: string) { }

	private static purifyRawData(rawData: GameMapJSON.Raw.Data) {
		let rd = rawData;
		rd.sizeInTiles = Vector.from(rd.sizeInTiles);
		rd.tileDataGeneratorArgs.overrides.forEach(o => {
			o.pos1 = Vector.from(o.pos1);
			o.pos2 = Vector.from(o.pos2);
		});

		return rd as GameMapJSON.Pure.Data;
	}

	async preload(loader: Loader) {
		const json = await loader.loadJSON(this.jsonFileUrl) as GameMapJSON.Raw.Data;
		this.data = GameMap.purifyRawData(json);

		const imgUrl = json.imageUrl;
		const img = await loader.loadImage(imgUrl);
		this.image = img;
	}
	init(): void {
		throw new Error("Method not implemented.");
	}
	update(controller: Controller): void {
		throw new Error("Method not implemented.");
	}
	render(ctx: CanvasRenderingContext2D): void {
		if (!this.image || !this.data) return;
		this.roamState.player.camera.drawImage(this.image, new Vector(), this.data.sizeInTiles);
	}
}