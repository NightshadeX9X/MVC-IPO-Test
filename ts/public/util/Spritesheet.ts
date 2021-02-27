import { New } from "./functions.js";
import { ArgsType } from "./types.js";
import Vector from "./Vector.js";

interface Spritesheet {
	coords: Vector;
	singleImageSize: Vector;
	imageCount: Vector;
	image: HTMLImageElement
}

class Spritesheet {
	constructor(...args: ArgsType<typeof Spritesheet["construct"]>) {
		return New(Spritesheet, ...args);
	}
	static construct(this: Spritesheet, image: HTMLImageElement, singleImageSize = new Vector(16, 32), imageCount = new Vector(4), coords = new Vector) {
		this.singleImageSize = singleImageSize;
		this.imageCount = imageCount;
		this.coords = coords;
		this.image = image;
		return this;
	}

	render(ctx: CanvasRenderingContext2D) {
		const coords = this.coords.prod(this.singleImageSize);
		ctx.drawImage(this.image, coords.x, coords.y, this.singleImageSize.x, this.singleImageSize.y, 0, 0, this.singleImageSize.x, this.singleImageSize.y)
	}
}

export default Spritesheet;