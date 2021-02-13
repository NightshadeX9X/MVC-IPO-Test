import { Preloadable, Renderable } from "../core/Attributes.js";
import Loader from "../core/Loader.js";
import GameMap from "./GameMap.js";

export default class GameMapLayer implements Preloadable, Renderable {
	private image: HTMLImageElement | null = null;
	constructor(public gameMap: GameMap, private imageName: string, public zIndex: number) {

	}

	async preload(loader: Loader) {
		this.image = await loader.loadImage(`/assets/images/maps/${this.gameMap.name}/${this.imageName}.png`)
	}
	render(ctx: CanvasRenderingContext2D): void {
		if (!this.image) return;
		ctx.drawImage(this.image, 0, 0);
	}
}