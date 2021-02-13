import { Entity } from "../core/Attributes.js";
import Input from "../core/Input.js";
import Loader from "../core/Loader.js";
import PlayerWalkingState from "../states/PlayerWalkingState.js";
import RoamState from "../states/RoamState.js";
import Direction, { directionToVector } from "../util/Direction.js";
import Vector from "../util/Vector.js";

export default class Player implements Entity {
	image: HTMLImageElement | null = null;
	pos = new Vector();
	zIndex = 1;
	constructor(public roamState: RoamState) {

	}
	async preload(loader: Loader) {
		this.image = await loader.loadImage(`/assets/images/people/player.png`);
	}
	update(input: Input): void {
		for (let key in input.directionKeyStates) {
			const d = key as keyof typeof input.directionKeyStates;
			if (!input.directionKeyStates[d] || this.roamState !== this.roamState.stateStack.fromTop()) continue;
			this.roamState.stateStack.push(new PlayerWalkingState(this.roamState.stateStack, this.roamState, Direction[d]))
		}

	}
	render(ctx: CanvasRenderingContext2D): void {
		if (this.image)
			ctx.drawImage(this.image, 0, 0, 16, 32, this.pos.x * 16, this.pos.y * 16, 16, 32);
	}
}