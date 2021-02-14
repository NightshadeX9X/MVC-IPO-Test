import Game from "./Game.js";
import Input from "./Input.js";
import Loader from "./Loader.js";
import State from "./State.js";
import Events from '../util/Events.js';

export default class StateStack<TParent extends Game | State = Game | State> {
	public states: State[] = [];
	public evtHandler = new Events.Handler();

	constructor(public parent: TParent, public game: Game) {

	}

	public async preload(loader: Loader) {
		const toPreload = this.states.filter((state) => state.preload && this.toPreloadState(state));
		await Promise.all(toPreload.map(state => (state as any).preload(loader)));
	}
	public update(input: Input) {
		this.states.filter((state) => state.update && this.toUpdateState(state)).forEach(state => (state as any).update(input));
	}
	public render(ctx: CanvasRenderingContext2D) {
		this.states.filter((state) => state.render && this.toRenderState(state)).forEach(state => (state as any).render(ctx));
	}

	public fromTop(n = this.states.length - 1) {
		return this.states[n];
	}
	public fromBottom(n = 0) {
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



	public async push(state: State) {
		this.states.push(state);
		this.evtHandler.dispatchEvent('state pushed', state);
		state.evtHandler.dispatchEvent('pushed');
		if (this.toPreloadState(state))
			await state.preload(this.game.loader);
	}
	public pop() {
		const state = this.states.pop();
		if (!state) return;
		this.evtHandler.dispatchEvent('state popped', state);
		state.evtHandler.dispatchEvent('popped');
	}
}