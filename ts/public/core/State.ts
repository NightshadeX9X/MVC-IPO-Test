import Events from "../util/Events.js";
import { New, Mixin } from "../util/functions.js";
import { ArgsType } from "../util/types.js";
import { Preloadable, Renderable, Updatable } from "./Attributes.js";
import Input from "./Input.js";
import StateStack from "./StateStack.js";

interface State extends Renderable, Updatable, Preloadable {
	stateStack: StateStack;
	subStateStack: StateStack;
	evtHandler: Events.Handler;
	blocking: boolean;
	linkedStates: State[];
	id: string;
}

class State {


	constructor(...args: ArgsType<typeof State["construct"]>) {
		return New(State, ...args);
	}

	static construct(this: State, stateStack: StateStack) {
		Renderable.construct.call(this);
		Updatable.construct.call(this);
		Preloadable.construct.call(this);

		this.stateStack = stateStack;
		this.subStateStack = new StateStack(this.stateStack.game, this);
		this.evtHandler = new Events.Handler();
		this.blocking = true;
		this.id = this.stateStack.game.stateIDGen.generate();
		this.linkedStates = [];

		return this;
	}

	render(ctx: CanvasRenderingContext2D) {
		this.subStateStack.render(ctx);
	}

	update(input: Input) {
		this.subStateStack.update(input);
	}

	remove() {
		this.stateStack.remove(this.stateStack.states.indexOf(this));
	}

	async waitForRemoval() {
		return new Promise<void>((res, rej) => {
			this.evtHandler.addEventListener('remove', () => {
				res();
			})
		})
	}

	get index() {
		return (this.stateStack?.states.indexOf(this)) ?? -1;
	}
}
Mixin.apply(State, [Renderable, Updatable, Preloadable]);

export default State;