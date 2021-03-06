import Events from "../util/Events.js";
import { Parents } from "../util/functions.js";
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

@Parents(Preloadable, Updatable, Renderable)
class State {
	subStateStack = new StateStack(this.stateStack.game, this);
	evtHandler = new Events.Handler();
	blocking = true;
	id = this.stateStack.game.stateIDGen.generate();
	linkedStates: State[] = [];

	constructor(public stateStack: StateStack) {
		Preloadable.call(this)
		Updatable.call(this)
		Renderable.call(this)
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

export default State;