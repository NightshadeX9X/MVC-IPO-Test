import { Entity } from "../Util.js";
import Input from "./Input.js";
import Loader from "./Loader.js";
import Player from "./Player.js";
import Renderer from "./Renderer.js";
import Vector from "./Vector.js";

export enum CameraMode {
	FOLLOW_PLAYER,
	FIXED
}
export default class Camera implements Entity {
	mode: CameraMode = CameraMode.FOLLOW_PLAYER;
	fixedPos = new Vector(4, 1)
	smoothing = 50;
	zoom = new Vector(1);
	currentPos = this.targetPos;
	buffer = document.createElement('canvas');
	bufferCtx = this.buffer.getContext('2d') as CanvasRenderingContext2D;

	constructor(public player: Player, public size: Vector) {
		this.buffer.width = this.size.x;
		this.buffer.height = this.size.y;
	}
	preload(loader: Loader): Promise<any> {
		throw new Error("Method not implemented.");
	}
	get differenceToTarget() {
		return this.targetPos.subtract(this.currentPos)
	}
	update(input: Input): void {
		if (!this.differenceToTarget.equals(new Vector())) {

			this.currentPos = this.currentPos.add(this.differenceToTarget.multiply(0.8));
		}
	}
	done = false;
	render(renderer: Renderer) {
		// E.G TO RENDER PLAYER
		// this.camera.render(this.renderer).image()
		this.bufferCtx.clearRect(0, 0, this.size.x, this.size.y)
		const self = this;
		return {
			image(img: HTMLImageElement, _pos: Vector, _size: Vector) {
				/*
				camera current pos 175 175
				object pos 100 100
				camera size 300 300

				if object x were 175 (camera currentpos x) - 150 (camera size x / 2) it would appear on the top left corner. So if object x were 35, it would appear at 10x on camera.
				*/
				const pos = _pos.subtract(self.currentPos.subtract(self.size.divide(2))).multiply(16);

				const size = _size.divide(self.player.roamState.currentMap?.sizeInPixels || new Vector(640, 480)).multiply(self.size.multiply(self.player.roamState.currentMap?.tileSizeInPx || 16))
				self.bufferCtx.drawImage(img, pos.x, pos.y, _size.x, _size.y);
				if (!self.done) {

					console.log(img, pos.x, pos.y, size.x, size.y)
					self.done = true;
				}

				renderer.ctx.drawImage(self.buffer, 0, 0);
			},
			imageComplex(img: HTMLImageElement, pos1: Vector, size1: Vector, _pos2: Vector, _size2: Vector) {
				const pos2 = _pos2.subtract(self.currentPos.subtract(self.size.divide(2)));
				self.bufferCtx.drawImage(img, pos1.x, pos1.y, size1.x, size1.y, pos2.x, pos2.y, _size2.x, _size2.y);
				renderer.ctx.drawImage(self.buffer, 0, 0);
			}
		}
	}
	get targetPos() {
		if (this.mode === CameraMode.FOLLOW_PLAYER)
			return this.player.pos;
		else if (this.mode === CameraMode.FIXED)
			return this.fixedPos || new Vector();

		return new Vector()
	}
}