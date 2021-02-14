import { Entity } from "../core/Attributes.js";
import Input from "../core/Input.js";
import Loader from "../core/Loader.js";
import PlayerWalkingState from "../states/PlayerWalkingState.js";
import RoamState from "../states/RoamState.js";
import Direction, { directionToVector } from "../util/Direction.js";
import Spritesheet from "../util/Spritesheet.js";
import Vector from "../util/Vector.js";

export default class Player implements Entity {
	image: HTMLImageElement | null = null;
	spritesheet: Spritesheet | null = null;
	pos = new Vector();
	direction = Direction.DOWN;
	zIndex = 1;
	constructor(public roamState: RoamState) {

	}
	async preload(loader: Loader) {
		this.image = await loader.loadImage(`/assets/images/people/player.png`);
		this.spritesheet = new Spritesheet(this.image, new Vector(16, 32), new Vector(4))
	}
	update(input: Input): void {
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
	render(ctx: CanvasRenderingContext2D): void {
		if (this.image && this.spritesheet) {
			ctx.save();
			ctx.translate(this.pos.x * this.roamState.tileSize, this.pos.y * this.roamState.tileSize);
			this.spritesheet.render(ctx);
			ctx.restore();
		}
	}
}