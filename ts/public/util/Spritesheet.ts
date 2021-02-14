import { Renderable } from "../core/Attributes.js";
import Vector from "./Vector.js";

export default class Spritesheet implements Renderable {
	pos = new Vector;
	constructor(public image: HTMLImageElement, public singleImageSizePx = new Vector(16, 32), public imageCount = new Vector(4)) {

	}

	public render(ctx: CanvasRenderingContext2D) {
		const selectionStartPx = this.pos.prod(this.singleImageSizePx);
		ctx.drawImage(this.image, selectionStartPx.x, selectionStartPx.y, this.singleImageSizePx.x, this.singleImageSizePx.y, 0, 0, this.singleImageSizePx.x, this.singleImageSizePx.y,);
	}
}