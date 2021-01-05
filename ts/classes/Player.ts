import { Entity } from "../Util.js";
import Renderer from "./Renderer.js";
import RoamState from "./states/RoamState.js";
import Vector from "./Vector.js";

export default class Player implements Entity {
	public cameraSize = new Vector(300, 450);
	constructor(private roamState: RoamState, public pos: Vector, public size: Vector) {

	}
	async preload() { }
	update(): void {
		this.pos = this.pos.add(1);
	}
	render(renderer: Renderer): void {
		renderer.rect(this.pos, this.size)
	}
}