import Events from "../util/Events.js";
import { insertIntoArray, Mixin, New } from "../util/functions.js";
import { ArgsType } from "../util/types.js";
import { Renderable, Updatable, Preloadable } from "./Attributes.js";
import Game from "./Game.js";
import Input from "./Input.js";
import Loader from "./Loader.js";
import State from "./State.js";
class StateStack {
	game: Game = null as any;
	parent: StateStack.Parent = null as any;
	states: State[] = null as any;
	evtHandler = New(Events.Handler);
	constructor(...args: ArgsType<typeof StateStack["construct"]>) {
		return New(StateStack, ...args);
	}
	static construct(this: StateStack, game: Game, parent: StateStack.Parent) {
		Renderable.construct.call(this);
		Updatable.construct.call(this);
		Preloadable.construct.call(this);

		this.game = game;
		this.parent = parent;
		this.states = [];
		this.evtHandler = New(Events.Handler);
		return this;
	}

	private isIndependentlyUpdatable(state: State) {
		if (!this.states.includes(state)) return false;
		if (state.toUpdate !== null) return state.toUpdate;
		return state === this.fromTop()
	}

	private toUpdateState(state: State) {
		return this.isIndependentlyUpdatable(state);
	}

	private toRenderState(state: State) {
		if (!this.states.includes(state)) return false;
		if (state.toUpdate !== null) return state.toUpdate;
		return true;
	}
	private toPreloadState(state: State) {
		return this.states.includes(state);
	}

	public fromTop(n = 0) {
		return this.states[this.states.length - (n + 1)];
	}
	public fromBottom(n = 0) {
		return this.states[n];
	}

	render(ctx: CanvasRenderingContext2D) {
		this.states.filter(state => this.toRenderState(state)).forEach(state => {
			state.render(ctx);
		})
	}

	async preload(loader: Loader) {
		await Promise.all(
			this.states.filter(state => this.toPreloadState(state)).map(state => state.preload(loader))
		);
	}

	update(input: Input) {

		this.states.filter(state => this.toUpdateState(state)).forEach(state => {

			state.update(input);
		})
	}

	async insertState(state: State, index: number) {
		await state.preload(this.game.loader);
		insertIntoArray(this.states, index, [state]);
		state.evtHandler.dispatchEvent('insert', this);
		this.evtHandler.dispatchEvent('state insert', state);
	}
	async push(state: State) {
		await state.preload(this.game.loader);
		this.states.push(state);
		state.evtHandler.dispatchEvent('insert', this);
		this.evtHandler.dispatchEvent('state insert', state);
	}
}

Mixin.apply(StateStack, [Renderable, Updatable, Preloadable]);
interface StateStack extends Renderable, Updatable, Preloadable { }

namespace StateStack {
	export type Parent = Game | State;
}

export default StateStack;