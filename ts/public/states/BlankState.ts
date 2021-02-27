import State from "../core/State.js";
import StateStack from "../core/StateStack.js";
import { ArgsType } from "../util/types.js";
import { Mixin, New } from '../util/functions.js';

interface BlankState extends State { }

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


export default BlankState;
