import State from "../core/State.js";
import StateStack from "../core/StateStack.js";
import { ArgsType } from "../util/types.js";
import { Parents } from '../util/functions.js';

interface BlankState extends State { }

@Parents(State)
class BlankState {
	constructor(public stateStack: StateStack) {
		State.call(this, stateStack)
	}
}



export default BlankState;
