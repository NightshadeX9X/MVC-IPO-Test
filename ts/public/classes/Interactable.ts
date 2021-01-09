import { Entity } from "../Util.js";
import Input from "./Input.js";
import Loader from "./Loader.js";
import Renderer from "./Renderer.js";
import Vector from "./Vector.js";
import { CutsceneStep } from './states/CutsceneState.js';
import GameMap from "./GameMap.js";

export type InteractionData = (CutsceneStep & { requiredStoryPoints?: string[] })[]

export default class Interactable implements Entity {
	public image: HTMLImageElement | null = null;
	public onInteraction: InteractionData = [];
	constructor(public gameMap: GameMap, public pos: Vector, public size: Vector, public imgUrl: string) {

	}
	async preload(loader: Loader) {
		this.image = await loader.image(this.imgUrl);
		console.log(this.image)
	}
	update(input: Input): void {
		throw new Error("Method not implemented.");
	}
	render(renderer: Renderer): void {
		if (this.image) {
			const pos = this.pos.subtract(this.size.divide(2)).multiply(this.gameMap.tileSizeInPx);
			const size = this.size.multiply(this.gameMap.tileSizeInPx);
			renderer.ctx.drawImage(this.image, pos.x, pos.y, size.x, size.y);

		}
	}
}