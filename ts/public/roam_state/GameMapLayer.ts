import { Preloadable, Renderable } from "../core/Attributes.js";
import Loader from "../core/Loader.js";
import GameMap from "./GameMap.js";
import Vector from '../util/Vector.js';

export default class GameMapLayer implements Preloadable, Renderable {
	private image: HTMLImageElement | null = null;
	public pos = new Vector;
	constructor(public gameMap: GameMap, private imageName: string, public zIndex: number) {

	}

	public async preload(loader: Loader) {
		this.image = await loader.loadImage(`/assets/images/maps/${this.gameMap.name}/${this.imageName}.png`)
	}
	public render(ctx: CanvasRenderingContext2D): void {
		if (!this.image) return;
		const coords = this.gameMap.roamState.camera.convertCoords(this.pos);
		this.gameMap.roamState.camera.ctx.drawImage(this.image, coords.x, coords.y);
	}
}