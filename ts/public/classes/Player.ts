import { Direction, Entity } from "../Util.js";
import Input from "./Input.js";
import Renderer from "./Renderer.js";
import RoamState from "./states/RoamState.js";
import Vector from "./Vector.js";
import PlayerMovingState from './states/PlayerMovingState.js';

export default class Player implements Entity {
	public cameraSize = new Vector(300, 450);
	public speed = new Vector(1)
	public facing = Direction.UP;
	constructor(public roamState: RoamState, public pos: Vector, public size: Vector) {
		this.speed = new Vector(Math.floor(this.speed.x), Math.floor(this.speed.y))
	}
	async preload() { }
	update(input: Input): void {
		if (input.keyIsDown('ArrowLeft')) {
			this.facing = Direction.LEFT;
			this.roamState.stateStack.push(new PlayerMovingState(this.roamState.stateStack, this));
		} else if (input.keyIsDown('ArrowUp')) {
			this.facing = Direction.UP;
			this.roamState.stateStack.push(new PlayerMovingState(this.roamState.stateStack, this));
		} else if (input.keyIsDown('ArrowRight')) {
			this.facing = Direction.RIGHT;
			this.roamState.stateStack.push(new PlayerMovingState(this.roamState.stateStack, this));
		} else if (input.keyIsDown('ArrowDown')) {
			this.facing = Direction.DOWN;
			this.roamState.stateStack.push(new PlayerMovingState(this.roamState.stateStack, this));
		}
	}
	render(renderer: Renderer): void {
		let multiplier = this.roamState.currentMap?.tileSizeInPx || 16;
		const pos = new Vector(this.pos.x, this.pos.y).subtract(new Vector(0, 1)).multiply(multiplier);
		const size = new Vector(this.size.x, this.size.y).multiply(multiplier);

		renderer.ctx.fillRect(pos.x, pos.y, size.x, size.y)
	}
}