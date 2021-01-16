import Player from "./Player.js";
import Vector from "./Vector.js";

export default class Camera {
	constructor(public player: Player, public size: Vector) {
		this.cnv.width = size.x;
		this.cnv.height = size.y;
	}
	public mode = CameraMode.FOLLOW_PLAYER;
	public pos = new Vector;
	public cnv = document.createElement('canvas');
	public ctx = this.cnv.getContext('2d') as CanvasRenderingContext2D;

	update() {
		this.pos = this.targetPos;
	}

	convertCoords(pos: Vector) {
		return pos.diff(this.pos).sum(this.size.quo(2));
	}

	get targetPos() {
		return this.player.pos.prod(this.player.roamState.tileSize);
	}
	clear() {
		this.ctx.clearRect(0, 0, this.size.x, this.size.y);
	}

	render(ctx: CanvasRenderingContext2D) {
		ctx.drawImage(this.cnv, 0, 0)
	}

}
export enum CameraMode {
	FOLLOW_PLAYER
}