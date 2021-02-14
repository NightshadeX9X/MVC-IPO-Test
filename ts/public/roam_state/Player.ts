import { Entity } from "../core/Attributes.js";
import Input from "../core/Input.js";
import Loader from "../core/Loader.js";
import PlayerWalkingState from "../states/PlayerWalkingState.js";
import RoamState from "../states/RoamState.js";
import Direction, { directionToVector } from "../util/Direction.js";
import Spritesheet from "../util/Spritesheet.js";
import Vector from "../util/Vector.js";

export default class Player implements Entity {
	public image: HTMLImageElement | null = null;
	public spritesheet: Spritesheet | null = null;
	public pos = new Vector();
	public size = new Vector(1);
	public drawSize = new Vector(1, 2);
	public direction = Direction.DOWN;
	public zIndex = 1;
	constructor(public roamState: RoamState) {

	}
	public async preload(loader: Loader) {
		this.image = await loader.loadImage(`/assets/images/people/player.png`);
		this.spritesheet = new Spritesheet(this.image, this.drawSize.prod(this.roamState.tileSize), new Vector(4))
	}
	public update(input: Input): void {
		for (let key in input.directionKeyStates) {
			const d = key as keyof typeof input.directionKeyStates;
			if (!input.directionKeyStates[d] || this.roamState !== this.roamState.stateStack.fromTop()) continue;
			this.setDirection(Direction[d]);
			this.roamState.stateStack.push(new PlayerWalkingState(this.roamState.stateStack, this.roamState, Direction[d]))
		}

	}
	private setDirection(d: Direction) {
		this.direction = d;
		this.updateSpritesheetY();
	}
	private updateSpritesheetY() {
		if (!this.spritesheet) return;
		if (this.direction === Direction.DOWN) this.spritesheet.pos.y = 0;
		if (this.direction === Direction.LEFT) this.spritesheet.pos.y = 1;
		if (this.direction === Direction.RIGHT) this.spritesheet.pos.y = 2;
		if (this.direction === Direction.UP) this.spritesheet.pos.y = 3;

	}
	public render(ctx: CanvasRenderingContext2D): void {
		if (this.image && this.spritesheet) {
			this.roamState.camera.ctx.save();
			const coords = this.roamState.camera.convertCoords(this.pos.diff(0, 1).prod(this.roamState.tileSize));
			// this.roamState.camera.ctx.translate(this.roamState.camera.size.x / 2, this.roamState.camera.size.y / 2 - this.drawSize.y * this.roamState.tileSize / 2);
			this.roamState.camera.ctx.translate(coords.x, coords.y);
			this.spritesheet.render(this.roamState.camera.ctx);
			this.roamState.camera.ctx.restore();
		}
	}
}