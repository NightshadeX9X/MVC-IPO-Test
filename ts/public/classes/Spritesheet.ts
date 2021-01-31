import Player from "./Player.js";
import Vector from "./Vector.js";

export default class Spritesheet {
	coords = new Vector();
	constructor(public image: HTMLImageElement, public size: Vector, public spriteCount = new Vector(4)) {

	}

	render(ctx: CanvasRenderingContext2D, pos: Vector) {
		const coords = this.coords.prod(this.size);
		ctx.drawImage(this.image, coords.x, coords.y, this.size.x, this.size.y, pos.x, pos.y, this.size.x, this.size.y);
	}

}