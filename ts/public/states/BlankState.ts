import State from "../core/State.js";
import StateStack from "../core/StateStack.js";
import { ArgsType } from "../util/types.js";
import { Mixin, New } from '../util/functions.js';

class BlankState {
	constructor(...args: ArgsType<typeof BlankState["construct"]>) {
		return New(BlankState, ...args);
	}
	static construct(this: BlankState, stateStack: StateStack) {
		State.construct.call(this, stateStack)
		return this;
	}
}

Mixin.apply(BlankState, [State]);

interface BlankState extends State { }

export default BlankState;
