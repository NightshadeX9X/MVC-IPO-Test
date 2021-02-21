import Events from "../util/Events.js";
import { New, Mixin } from "../util/functions.js";
import { ArgsType } from "../util/types.js";
import { Preloadable, Renderable, Updatable } from "./Attributes.js";
import Input from "./Input.js";
import StateStack from "./StateStack.js";
class State {
	stateStack: StateStack = null as any;
	subStateStack: StateStack = null as any;
	evtHandler: Events.Handler = null as any;
	blocking: boolean = null as any;
	linkedStates: State[] = null as any;
	id: string = null as any;

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
interface State extends Renderable, Updatable, Preloadable { }

export default State;