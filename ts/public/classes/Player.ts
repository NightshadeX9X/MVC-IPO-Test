import { Direction, Entity } from "../Util.js";
import Input from "./Input.js";
import Renderer from "./Renderer.js";
import RoamState from "./states/RoamState.js";
import Vector from "./Vector.js";
import PlayerMovingState from './states/PlayerMovingState.js';
import Loader from "./Loader.js";

export default class Player implements Entity {
	public cameraSize = new Vector(480, 320);
	public speed = new Vector(1)
	public facing = Direction.UP;
	public spriteSheetCords = new Vector(0, 0);
	public spriteSheetSrc = '../../assets/images/people/player.png';
	public spriteSheet: HTMLImageElement | null = null;
	constructor(public roamState: RoamState, public pos: Vector, public size: Vector) {
		this.speed = new Vector(Math.floor(this.speed.x), Math.floor(this.speed.y))
	}
	async preload(loader: Loader) {
		const image = await loader.image(this.spriteSheetSrc);
		this.spriteSheet = image;
	}
	update(input: Input): void {
		if (input.keyIsDown('ArrowLeft')) {
			this.facing = Direction.LEFT;
			this.spriteSheetCords.y = 2;

			this.roamState.stateStack.push(new PlayerMovingState(this.roamState.stateStack, this));
		} else if (input.keyIsDown('ArrowUp')) {
			this.facing = Direction.UP;
			this.spriteSheetCords.y = 6;

			this.roamState.stateStack.push(new PlayerMovingState(this.roamState.stateStack, this));
		} else if (input.keyIsDown('ArrowRight')) {
			this.facing = Direction.RIGHT;
			this.spriteSheetCords.y = 4;
			this.roamState.stateStack.push(new PlayerMovingState(this.roamState.stateStack, this));
		} else if (input.keyIsDown('ArrowDown')) {
			this.facing = Direction.DOWN;
			this.spriteSheetCords.y = 0;
			this.roamState.stateStack.push(new PlayerMovingState(this.roamState.stateStack, this));
		}
	}
	render(renderer: Renderer): void {
		let multiplier = this.roamState.currentMap?.tileSizeInPx || 16;
		// const pos = new Vector(this.pos.x, this.pos.y).subtract(new Vector(0, 1)).multiply(multiplier);
		const pos = new Vector(15, 10).subtract(new Vector(0, 1)).multiply(multiplier);
		const size = this.size.multiply(multiplier);
		const spriteSheetCords = this.spriteSheetCords.multiply(multiplier)

		// renderer.ctx.fillRect(pos.x, pos.y, size.x, size.y)
		// renderer.rect(new Vector(15.5, 10).multiply(16), this.size.multiply(16))
		if (this.spriteSheet) {
			renderer.ctx.drawImage(this.spriteSheet, spriteSheetCords.x, spriteSheetCords.y, size.x, size.y, pos.x, pos.y, size.x, size.y)
		}
	}
}