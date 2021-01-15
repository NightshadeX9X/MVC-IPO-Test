import Player from "./Player.js";
import Vector from "./Vector.js";

export default class Spritesheet {
	coords = new Vector();
	constructor(public image: HTMLImageElement, public size: Vector, public player: Player, public spriteCount = new Vector(4)) {

	}

	render(ctx: CanvasRenderingContext2D, pos: Vector) {
		if (!this.image) return;
		const coords = this.coords.prod(this.player.roamState.tileSize).prod(this.size)
		const size = this.size.prod(this.player.roamState.tileSize);
		ctx.drawImage(this.image, coords.x, coords.y, size.x, size.y, pos.x, pos.y, size.x, size.y)
	}
}