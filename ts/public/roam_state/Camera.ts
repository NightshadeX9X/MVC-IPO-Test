import RoamState from "../states/RoamState.js";
import { createCanvas } from "../util/functions.js";
import Vector from "../util/Vector.js";

class Camera {
	public mode = Camera.Mode.FOLLOW_PLAYER;
	public fixedPos = new Vector;
	public pos = Vector.from(this.fixedPos);
	public cnv: HTMLCanvasElement;
	public ctx: CanvasRenderingContext2D;
	public smoothing = 30;
	public zoom = 1;
	private startingSize = new Vector(240, 160)

	constructor(public roamState: RoamState) {
		const cnvData = createCanvas(this.startingSize);
		this.cnv = cnvData.cnv;
		this.ctx = cnvData.ctx;
		this.ctx.imageSmoothingEnabled = false;
	}

	public get size() {
		return new Vector(this.cnv.width, this.cnv.height);
	}
	public convertCoords(coords: Vector) {
		const halfSize = this.size.quo(2);
		return halfSize.diff(this.pos).sum(coords);
	}

	private advanceTowardsTarget() {
		/* this.pos.add(this.distanceFromTarget.prod(1 / this.smoothing));
		if (this.distanceFromTarget.map(Math.abs).lessThanOrEqualTo(1)) {
			this.pos.set(this.target);
		} */
		this.pos.set(this.target)
	}

	private get distanceFromTarget() {
		return this.target.diff(this.pos);
	}

	public update() {
		this.advanceTowardsTarget();
		this.cnv.width = this.startingSize.quo(this.zoom).x;
		this.cnv.height = this.startingSize.quo(this.zoom).y;
	}

	public render(ctx: CanvasRenderingContext2D) {
		ctx.save();
		ctx.scale(this.zoom, this.zoom)
		ctx.drawImage(this.cnv, 0, 0);
		ctx.restore();
		this.ctx.clearRect(0, 0, this.size.x, this.size.y)
	}

	public fixTo(pos: Vector) {
		this.mode = Camera.Mode.FIXED;
		this.fixedPos = pos;
	}

	private get target() {
		if (this.mode === Camera.Mode.FOLLOW_PLAYER) {
			return this.roamState.player.pos.sum(0.5, 0).prod(this.roamState.tileSize);
		}

		return this.fixedPos;
	}
}

namespace Camera {
	export const enum Mode {
		FOLLOW_PLAYER,
		FIXED
	}
}

export default Camera;
