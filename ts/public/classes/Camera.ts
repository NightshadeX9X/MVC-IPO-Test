import { random } from "../Util.js";
import Player from "./Player.js";
import Vector from "./Vector.js";

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
	}

	convertCoords(pos: Vector) {
		return pos.diff(this.pos).sum(this.size.quo(2));
	}

	get targetPos() {
		if (this.mode === CameraMode.FOLLOW_PLAYER)
			return this.player.pos.sum(0.5, 0.5).prod(this.player.roamState.tileSize);
		else
			return this.fixedPos;
	}
	clear() {
		this.ctx.clearRect(0, 0, this.size.x, this.size.y);
	}

	render(ctx: CanvasRenderingContext2D) {
		const cnv = document.createElement('canvas');
		const _ctx = cnv.getContext('2d') as CanvasRenderingContext2D;
		cnv.width = this.cnv.width * this.zoom;
		cnv.height = this.cnv.height * this.zoom;
		ctx.scale(this.zoom, this.zoom);
		ctx.imageSmoothingEnabled = false;
		_ctx.drawImage(this.cnv, 0, 0);

		const toDrawCameraPos = new Vector;
		ctx.drawImage(cnv, toDrawCameraPos.x, toDrawCameraPos.y);
		ctx.scale(1 / this.zoom, 1 / this.zoom);

	}

}
export enum CameraMode {
	FOLLOW_PLAYER
}