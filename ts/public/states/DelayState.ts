import State from "../core/State.js";
import StateStack from "../core/StateStack.js";
import { ArgsType } from "../util/types.js";
import { Mixin, New } from '../util/functions.js';

interface DelayState extends State { }
class DelayState {
	totalFrames: number = null as any;
	elapsedFrames: number = null as any;

	constructor(...args: ArgsType<typeof DelayState["construct"]>) {
		return New(DelayState, ...args);
	}
	static construct(this: DelayState, stateStack: StateStack, totalFrames = 60) {
		State.construct.call(this, stateStack);
		this.totalFrames = totalFrames;
		this.elapsedFrames = 0;
		return this;
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
Mixin.apply(DelayState, [State]);


export default DelayState;