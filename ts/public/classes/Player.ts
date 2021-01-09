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

	}
	async preload() {
		throw new Error("Method not implemented.");
	}
	init(): void {
		throw new Error("Method not implemented.");
	}
	update(controller: Controller): void {
		this.camera.update();
	}
	render(ctx: CanvasRenderingContext2D): void {
		throw new Error("Method not implemented.");
	}

}