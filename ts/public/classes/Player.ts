import Entity from "../Entity.js";
import { Direction, directionToVector } from "../Util.js";
import Input from "./Input.js";
import Loader from "./Loader.js";
import Spritesheet from "./Spritesheet.js";
import PlayerMovingState from "./states/PlayerMovingState.js";
import RoamState from "./states/RoamState.js";
import Vector from "./Vector.js";

export default class Player implements Entity {
	public pos = new Vector(10, 5);
	public drawSize = new Vector(1, 2);
	public drawOffset = new Vector(0, -1);
	public image: HTMLImageElement | null = null;
	public spritesheet: Spritesheet | null = null;
	toUpdate: boolean | null = true;
	toRender: boolean | null = true;
	toPreload: boolean | null = true;

	constructor(public roamState: RoamState) {

	}
	async preload(loader: Loader) {
		this.image = await loader.loadImage(`/assets/images/people/player.png`);
		this.spritesheet = new Spritesheet(this.image, this.drawSize, this);
	}
	init(): void {
		if (!this.spritesheet) return;

	}
	update(input: Input): void {
		if (!this.spritesheet) return;
		const dirStrs = ["down", "left", "up", "right"];
		dirStrs.forEach(dirStr => {
			if (this.roamState.stateStack.fromTop() === this.roamState && (input.directionKeyStates as any)[dirStr.toUpperCase()] === true) {
				this.roamState.stateStack.push(new PlayerMovingState(this.roamState.stateStack, this.roamState, Direction[dirStr.toUpperCase() as keyof typeof Direction]))
			}
		})
	}
	render(ctx: CanvasRenderingContext2D): void {
		if (!this.image || !this.spritesheet) return;
		const pos = this.pos.sum(this.drawOffset).prod(this.roamState.tileSize).diff(0, 1);
		const size = this.drawSize.prod(this.roamState.tileSize)
		const spriteCoords = this.spritesheet.coords.prod(this.roamState.tileSize).prod(this.drawSize);
		ctx.drawImage(this.image, spriteCoords.x, spriteCoords.y, size.x, size.y, pos.x, pos.y, size.x, size.y)
	}
}