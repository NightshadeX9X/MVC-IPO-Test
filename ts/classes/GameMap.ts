import { Entity } from "../Util.js";
import Renderer from "./Renderer.js";
import Vector from "./Vector.js";

/**
GameMaps will have an imgUrl, width, height, tileData, and interactable. An interactable is an interface that a player can interact with, like a note on a table.

Interactables will have activation points, from where they can be activated. An activation point includes an pos Vector and directions that the player must face to activate the Interactables. Interactables will also have the text that will be displayed upon interaction.
*/
export default class GameMap implements Entity {
	img: HTMLImageElement | undefined = undefined;
	constructor(public name: string, public imgUrl: string, public sizeInTiles: Vector, public tileSizeInPx = 16) { }

	async preload(): Promise<HTMLImageElement | void> {
		return new Promise((res) => {
			const image = new Image();
			image.addEventListener('load', e => {
				this.img = image;
				res(image);
			})
			image.src = this.imgUrl;
		})
	}

	update() {

	}

	render(renderer: Renderer) {
		if (!this.img) return;
		renderer.ctx.drawImage(this.img, 0, 0);
	}
}