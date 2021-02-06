import { random } from "../../Util.js";
import Player from "./Player.js";
import Vector from "../Vector.js";

export default class Camera {
	zoom = 1;
	constructor(public player: Player, public size: Vector) {
		this.size.div(this.zoom)
		this.cnv.width = size.x;
		this.cnv.height = size.y;
	}
	public mode = CameraMode.FOLLOW_PLAYER;
	public pos = new Vector;
	public smoothing = 0;
	public cnv = document.createElement('canvas');
	public ctx = this.cnv.getContext('2d') as CanvasRenderingContext2D;
	fixedPos = this.player.pos;

	incrementPos() {
		if (this.smoothing === 0) {
			this.pos = this.targetPos;
			return;
		}
		const smoothing = this.smoothing + 14;
		const diff = this.targetPos.diff(this.pos);
		const cutoff = (smoothing * 0.1 + 13) / smoothing;
		if (!diff.mapReturn(Math.abs).lessThan(cutoff)) {
			this.pos.add(diff.quo(smoothing));
		} else {
			this.pos = this.targetPos;
		}

	}
	init() {
		this.pos = this.targetPos;
	}
	update() {
		this.incrementPos();
		this.cnv.width = this.size.x / this.zoom;
		this.cnv.height = this.size.y / this.zoom;
	}

	convertCoords(pos: Vector) {
		return pos.diff(this.pos).sum(this.cnv.width / 2, this.cnv.height / 2)
	}

	get targetPos() {
		if (this.mode === CameraMode.FOLLOW_PLAYER)
			return this.player.pos.sum(0, 0).prod(this.player.roamState.tileSize);
		else
			return this.fixedPos;
	}
	clear() {
		this.ctx.clearRect(0, 0, this.size.x, this.size.y);
	}

	render(ctx: CanvasRenderingContext2D) {

		ctx.save();
		ctx.scale(this.zoom, this.zoom)
		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(this.cnv, 0, 0)
		ctx.restore();

	}

}
export enum CameraMode {
	FOLLOW_PLAYER
}