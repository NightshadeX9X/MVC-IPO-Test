import { Preloadable, Renderable } from "../public/core/Attributes.js";
import Loader from "../public/core/Loader.js";
import RoamState from "../public/states/RoamState.js";
import { Mixin, New } from "../public/util/functions.js";
import { ArgsType } from "../public/util/types.js";
import Vector from "../public/util/Vector.js";

class Walker {
	pos = new Vector;
	imageUrl = "";
	image = new Image();
	roamState: RoamState = null as any;

	constructor(...args: ArgsType<typeof Walker["construct"]>) {
		return New(Walker, ...args);
	}
	static construct(this: Walker, roamState: RoamState, pos: Vector, imageUrl: string) {
		Preloadable.construct.call(this);
		Renderable.construct.call(this);

		this.pos = pos;
		this.imageUrl = imageUrl;
		this.roamState = roamState;
		return this;
	}

	async preload(loader: Loader) {
		this.image = await loader.loadImage(`/assets/images/characters/${this.imageUrl}.png`);
	}

	render(ctx: CanvasRenderingContext2D) {
		if (!this.image) return;
		ctx.drawImage(this.image, this.pos.x, this.pos.y, this.roamState.tileSize, this.roamState.tileSize)
	}

}
Mixin.apply(Walker, [Preloadable, Renderable])
interface Walker extends Preloadable, Renderable { }

export default Walker;