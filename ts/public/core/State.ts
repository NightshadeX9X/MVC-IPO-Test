import Events from "../util/Events.js";
import { New, Mixin } from "../util/functions.js";
import { ArgsType } from "../util/types.js";
import { Preloadable, Renderable, Updatable } from "./Attributes.js";
import Input from "./Input.js";
import StateStack from "./StateStack.js";
class State {
	stateStack: StateStack = null as any;
	subStateStack = new StateStack(this.stateStack.game, this);
	evtHandler = New(Events.Handler);

	constructor(...args: ArgsType<typeof State["construct"]>) {
		return New(State, ...args);
	}

	static construct(this: State, stateStack: StateStack) {
		Renderable.construct.call(this);
		Updatable.construct.call(this);
		Preloadable.construct.call(this);

		this.stateStack = stateStack;
		this.subStateStack = new StateStack(this.stateStack.game, this);
		this.evtHandler = New(Events.Handler);

		return this;
	}

	render(ctx: CanvasRenderingContext2D) {
		this.subStateStack.render(ctx);
	}

	update(input: Input) {
		this.subStateStack.update(input);
	}
}
Mixin.apply(State, [Renderable, Updatable, Preloadable]);
interface State extends Renderable, Updatable, Preloadable { }

export default State;