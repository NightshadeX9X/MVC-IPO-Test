import { Renderable } from "../core/Attributes.js";
import { Parents } from "./functions.js";
import { ArgsType } from "./types.js";
import Vector from "./Vector.js";

interface Spritesheet extends Renderable { }

@Parents(Renderable)
class Spritesheet {
	constructor(public image: HTMLImageElement, public singleImageSize = new Vector(16, 32), public imageCount = new Vector(4), public coords = new Vector) {
		Renderable.call(this);
	}

	render(ctx: CanvasRenderingContext2D) {
		const coords = this.coords.prod(this.singleImageSize);
		ctx.drawImage(this.image, coords.x, coords.y, this.singleImageSize.x, this.singleImageSize.y, 0, 0, this.singleImageSize.x, this.singleImageSize.y)
	}
}

export default Spritesheet;