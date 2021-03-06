import { Renderable, Updatable } from "../core/Attributes.js";
import RoamState from "../states/RoamState.js";
import { createCanvas, Parents, } from "../util/functions.js";
import { ArgsType } from "../util/types.js";
import Vector from "../util/Vector.js";

interface Camera extends Updatable, Renderable { }

@Parents(Updatable, Renderable)
class Camera {
	cnv: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	mode = Camera.Mode.FOLLOW_PLAYER;
	fixedPos = new Vector;
	pos = new Vector(this.targetPos.x, this.targetPos.y);
	constructor(public roamState: RoamState, public size: Vector) {
		Updatable.call(this);
		Renderable.call(this);

		const canvas = createCanvas(this.size);
		this.cnv = canvas.cnv;
		this.ctx = canvas.ctx;
	}
	static construct(this: Camera,) {



		return this;
	}

	update() {
		if (this.pos.distFrom(this.targetPos) > 1)
			this.moveCloserToTarget();
		else
			this.pos.set(this.targetPos);
	}
	convertCoords(pos: Vector) {
		return pos.diff(this.pos).sum(this.size.quo(2));
	}
	render(ctx: CanvasRenderingContext2D) {
		ctx.drawImage(this.cnv, 0, 0);
		this.ctx.clearRect(0, 0, this.size.x, this.size.y);
	}
	private moveCloserToTarget() {
		this.pos.add(this.targetPos.diff(this.pos).quo(16))
	}
	private get targetPos() {
		let target = new Vector();
		if (this.mode === Camera.Mode.FOLLOW_PLAYER) target.set(this.roamState.player.pos.sum(0.5, 0).prod(this.roamState.tileSize));
		else target.set(this.fixedPos);
		return target;
	}
}

namespace Camera {
	export enum Mode {
		FOLLOW_PLAYER,
		FIXED
	}
}

export default Camera;