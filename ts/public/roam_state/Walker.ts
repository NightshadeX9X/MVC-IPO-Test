import DelayState from "../states/DelayState.js";
import RoamState from "../states/RoamState.js";
import Direction, { directionToVector } from "../util/Direction.js";
import Spritesheet from "../util/Spritesheet.js";
import Vector from "../util/Vector.js";
import Events from '../util/Events.js';

export default class MWalker {
	pos: Vector = null as any;
	spritesheet: Spritesheet | null = null as any;
	roamState: RoamState = null as any;
	evtHandler: Events.Handler = null as any;

	static construct(this: {
		pos: Vector;
		spritesheet: Spritesheet | null;
		roamState: RoamState;
		evtHandler: Events.Handler;
	}) { }

	private async takeStep(direction: Direction) {
		const vector = directionToVector(direction)
		const createDelay = async () => {
			const delay = new DelayState(this.roamState.stateStack, 1);
			this.roamState.stateStack.push(delay);
			await delay.pop();
		}
		if (this.spritesheet) {

			this.spritesheet.pos.x++;
			if (this.spritesheet.pos.x >= 4) this.spritesheet.pos.x = 0;
		}

		for (let i = 0; i < 4; i++) {

			this.roamState.player.pos.add(vector.quo(16));
			await createDelay();
		}

	}

	public async walk(direction: Direction) {
		const oldPos = Vector.from(this.pos);
		for (let i = 0; i < 4; i++) {
			await this.takeStep(direction);
		}
		// this.pos.set(oldPos.sum(directionToVector(direction)));
		this.evtHandler.dispatchEvent('walking done')
	}
}