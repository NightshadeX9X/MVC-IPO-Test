import Entity from "../Entity.js";
import Input from "./Input.js";
import Loader from "./Loader.js";
import State from "./State.js";
import RoamState from "./states/RoamState.js";

export default class StateStack implements Entity {

	constructor(public loader: Loader) {

	}
	public states: State[] = [];

	public toPreload: boolean | null = true;
	public toUpdate: boolean | null = true;
	public toRender: boolean | null = true;

	async preload() {
		await Promise.all(this.states.map(s => s.preload(this.loader)))
	}
	private get statesToUpdate() {
		return this.states.filter(s => {
			if (s.toUpdate !== null) return s.toUpdate;
			return s === this.fromTop();
		})
	}
	init(): void {
		this.states.forEach(s => {
			s.init();
		})
	}
	update(input: Input): void {
		this.statesToUpdate.forEach(s => s.update(input))
	}
	render(ctx: CanvasRenderingContext2D): void {
		this.states.forEach(s => s.render(ctx));
	}

	public fromTop(n = 0) {
		return this.states[this.states.length - 1 - n];
	}
	public fromBottom(n = 0) {
		return this.states[n];
	}

	async push(s: State) {
		this.states.push(s);
		await s.preload(this.loader);
		s.init();
	}
	pop() {
		return this.states.pop();
	}
}