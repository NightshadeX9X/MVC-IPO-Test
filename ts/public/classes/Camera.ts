import Player from "./Player.js";
import Tweener from "./Tweener.js";
import Vector from "./Vector.js";

export enum CameraMode {
	FOLLOW_PLAYER,
	FIXED
}
export enum CameraEffects {
	SHAKE
}
export default class Camera {
	public mode: CameraMode = CameraMode.FOLLOW_PLAYER;
	public pos = Vector.from(this.player.pos).multiply(this.player.roamState.tileSize);
	public size = new Vector(480, 320);
	public _zoom = new Vector(1);
	public fixedPos = new Vector(11, 6).multiply(this.player.roamState.tileSize);
	public smoothing = 5;
	public cnv = document.createElement('canvas');
	public ctx = this.cnv.getContext('2d') as CanvasRenderingContext2D
	get snap() {
		return this.smoothing / 15;
	}
	constructor(public player: Player) {
		console.log(this.pos)
		this.cnv.width = this.size.x;
		this.cnv.height = this.size.y;
	}
	get zoom() {
		return this._zoom;
	}
	set zoom(val) {
		if (val.x <= 0 || val.y <= 0) return;
		this._zoom = val
	}

	update() {
		this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height)
		if (this.smoothing === 0)
			this.pos = this.targetPos;
		else
			this.pos = this.pos.add(this.deltaPos?.divide(this.smoothing));
		const absDelta = this.deltaPos.map(Math.abs);

		if (absDelta.x <= this.snap && absDelta.y <= this.snap) {
			this.pos = this.targetPos;
		}

	}
	render(ctx: CanvasRenderingContext2D) {
		ctx.drawImage(this.cnv, 0, 0)
	}
	drawImage(img: HTMLImageElement, _pos: Vector, _size: Vector) {
		const pos = this.pos.multiply(this.zoom.multiply(-1)).add(this.size.divide(2));
		const size = _size.multiply(this.player.roamState.tileSize).multiply(this.zoom);
		this.ctx.drawImage(img, pos.x, pos.y, size.x, size.y);
	}

	public get deltaPos() {
		return this.targetPos.subtract(this.pos);
	}

	public get targetPos() {
		if (this.mode === CameraMode.FOLLOW_PLAYER) return this.player.pos.multiply(this.player.roamState.tileSize);
		else if (this.mode === CameraMode.FIXED) return this.fixedPos;
		else return new Vector()
	}
}