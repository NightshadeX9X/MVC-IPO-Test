import { create, Mixin } from "../util/functions.js";
import { Renderable } from "./Attributes.js";
import StateStack from "./StateStack.js";
abstract class State {
	stateStack: StateStack = null as any;
	subStateStack: StateStack = null as any;

	static construct(this: State, stateStack: StateStack) {
		Renderable.construct.call(this);

		this.stateStack = stateStack;
		this.subStateStack = create(StateStack, this.stateStack.game, this);
		return this;
	}
}
Mixin.apply(State, [Renderable]);
interface State extends Renderable { }

export default State;