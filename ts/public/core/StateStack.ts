import Events from "../util/Events.js";
import { insertIntoArray, Parents } from "../util/functions.js";
import { ArgsType } from "../util/types.js";
import { Renderable, Updatable, Preloadable } from "./Attributes.js";
import Game from "./Game.js";
import Input from "./Input.js";
import Loader from "./Loader.js";
import State from "./State.js";

interface StateStack extends Renderable, Updatable, Preloadable { }
@Parents(Preloadable, Updatable, Renderable)
class StateStack {
	states: State[] = [];
	evtHandler = new Events.Handler();
	constructor(public game: Game, public parent: StateStack.Parent) {
		Preloadable.call(this)
		Updatable.call(this)
		Renderable.call(this)
	}

	private isIndependentlyUpdatable(state: State) {
		if (!this.states.includes(state)) return false;
		if (state.toUpdate !== null) return state.toUpdate;
		return this.states.filter(s => s.blocking).reverse()[0] === state;
	}

	private isLinkedToIndependentlyUpdatable(state: State) {
		return this.states.filter(s => this.isIndependentlyUpdatable(s)).some(s => s.linkedStates.includes(state))
	}

	private toUpdateState(state: State) {
		return this.isIndependentlyUpdatable(state) || this.isLinkedToIndependentlyUpdatable(state);
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

	/* async preload(loader: Loader) {
		console.log("ss", this.states)
		await Promise.all(
			this.states.filter(state => this.toPreloadState(state)).map(state => state.preload(loader))
		);
	} */

	update(input: Input) {

		this.states.filter(state => this.toUpdateState(state)).forEach(state => {

			state.update(input);
		})
	}

	async insert(state: State, index: number) {
		if (!state) return;
		await state.preload(this.game.loader);
		this.states = insertIntoArray(this.states, index, [state]);

		state.evtHandler.dispatchEvent('insert', this);
		this.evtHandler.dispatchEvent('state insert', state);
	}
	async push(state: State) {
		await this.insert(state, this.states.length);
	}

	pop() {
		this.remove(this.states.length - 1);
	}

	remove(index: number) {
		const state = this.states[index];
		this.states.splice(index, 1);

		state?.evtHandler.dispatchEvent('remove');
		this.evtHandler.dispatchEvent('state remove');
	}
}



namespace StateStack {
	export type Parent = Game | State;
}

export default StateStack;