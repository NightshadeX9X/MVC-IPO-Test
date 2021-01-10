import { Direction, Entity } from "../Util.js";
import Camera from "./Camera.js";
import Controller from "./Controller.js";
import PlayerMovingState from "./states/PlayerMovingState.js";
import RoamState from "./states/RoamState.js";
import Vector from "./Vector.js";

export default class Player implements Entity {
	public pos = new Vector(18, 1);
	public size = new Vector(1, 1);
	public drawSize = new Vector(1, 2);
	public camera = new Camera(this);
	public moving = false;
	public facing = Direction.DOWN;


	constructor(public roamState: RoamState) {
		this.camera.smoothing = 0;
	}
	async preload() {
		throw new Error("Method not implemented.");
	}
	init(): void {
		throw new Error("Method not implemented.");
	}
	update(controller: Controller): void {
		let direction: Direction | null = null;
		if (controller.keyIsDown("ArrowUp")) direction = Direction.UP;
		if (controller.keyIsDown("ArrowDown")) direction = Direction.DOWN;
		if (controller.keyIsDown("ArrowLeft")) direction = Direction.LEFT;
		if (controller.keyIsDown("ArrowRight")) direction = Direction.RIGHT;

		if (direction !== null) {
			const playerMovingState = new PlayerMovingState(this.roamState.stateStack, direction, this);
			this.roamState.stateStack.push(playerMovingState);
		}
		this.camera.update();
	}
	render(ctx: CanvasRenderingContext2D): void {
		this.camera.rect(this.pos.subtract(new Vector(0, 1)).multiply(16), this.drawSize)
	}

}