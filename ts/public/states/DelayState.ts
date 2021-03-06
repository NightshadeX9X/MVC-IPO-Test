import State from "../core/State.js";
import StateStack from "../core/StateStack.js";
import { ArgsType } from "../util/types.js";
import { Parents } from '../util/functions.js';

interface DelayState extends State { }
@Parents(State)
class DelayState {
	elapsedFrames = 0;

	constructor(public stateStack: StateStack, public totalFrames = 60) {
		State.call(this, stateStack)
	}

	private get remainingFrames() {
		return this.totalFrames - this.elapsedFrames - 1;
	}

	update() {
		if (this.remainingFrames <= 0) {
			this.remove();
			return;
		}
		this.elapsedFrames++;
	}

	static async create(ss: StateStack, frames: number) {
		const ds = new DelayState(ss, frames);
		await ss.push(ds);
		await ds.waitForRemoval();
	}
}

export default DelayState;