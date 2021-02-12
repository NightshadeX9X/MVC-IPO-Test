import Game from "./Game.js";
import Input from "./Input.js";
import Loader from "./Loader.js";
import State from "./State.js";
import Events from '../util/Events.js';

export default class StateStack<TParent extends Game | State = State> {
	states: State[] = [];
	evtHandler = new Events.Handler();

	constructor(public parent: TParent, public game: Game) {

	}

	async preload(loader: Loader) {
		const toPreload = this.states.filter((s) => this.toPreloadState(s));
		await Promise.all(toPreload.map(state => state.preload(loader)));
	}
	update(input: Input) {
		this.states.filter((s) => this.toUpdateState(s)).forEach(s => s.update(input));
	}
	render(ctx: CanvasRenderingContext2D) {
		this.states.filter((s) => this.toRenderState(s)).forEach(s => s.render(ctx));
	}

	fromTop(n = this.states.length - 1) {
		return this.states[n];
	}
	fromBottom(n = 0) {
		return this.states[n];
	}

	private toPreloadState(state: State) {
		if (typeof state.toPreload === "boolean") return state.toPreload;
		return true;
	}
	private toUpdateState(state: State) {
		if (typeof state.toUpdate === "boolean") return state.toUpdate;
		return this.fromTop() === state;
	}
	private toRenderState(state: State) {
		if (typeof state.toRender === "boolean") return state.toRender;
		return true;
	}



	async push(state: State) {
		if (this.toPreloadState(state))
			await state.preload(this.game.loader);
		this.states.push(state);
		this.evtHandler.dispatchEvent('state pushed', state);
		state.evtHandler.dispatchEvent('pushed');
	}
	pop() {
		const state = this.states.pop();
		if (!state) return;
		this.evtHandler.dispatchEvent('state popped', state);
		state.evtHandler.dispatchEvent('popped');
	}
}