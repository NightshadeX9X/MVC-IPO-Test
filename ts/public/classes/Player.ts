import { Entity } from "../interfaces.js";
import Camera from "./Camera.js";
import Controller from "./Controller.js";
import RoamState from "./states/RoamState.js";
import Vector from "./Vector.js";

export default class Player implements Entity {
	public pos = new Vector(18, 1);
	public size = new Vector(1, 1);
	public drawSize = new Vector(1, 2);
	public camera = new Camera(this);
	public moving = false;


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
		let vec = new Vector();
		if (controller.keyIsDown("ArrowUp")) vec.y = -1;
		if (controller.keyIsDown("ArrowDown")) vec.y = 1;
		if (controller.keyIsDown("ArrowLeft")) vec.x = -1;
		if (controller.keyIsDown("ArrowRight")) vec.x = 1;
		this.pos = this.pos.add(vec.multiply(1))
		if (!vec.equals(new Vector()))
			console.log(this.pos)
		this.camera.update();
	}
	render(ctx: CanvasRenderingContext2D): void {
		this.camera.rect(this.pos.subtract(new Vector(0, 1)).multiply(16), this.drawSize)
	}

}