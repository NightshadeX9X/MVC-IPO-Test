import { Entity } from "../Util.js";
import Renderer from "./Renderer.js";
import RoamState from "./states/RoamState.js";
import State from "./states/State.js";

export default class StateStack implements Entity {
	public states: State[] = [];

	constructor() {
		this.push(new RoamState());
	}

	async push(s: State) {
		this.states.push(s);
		await this.top?.preload()
	}

	pop() {
		return this.states.pop();
	}

	get top(): State | undefined {
		return this.states[this.states.length - 1];
	}

	get bottom(): State | undefined {
		return this.states[0];
	}
	async preload() {
		for await (let s of this.states) {
			await s.preload();
		}
	}
	update(): void {

		this.states.filter(s => s.forceUpdate || s === this.top).forEach(s => s.update());
	}
	render(renderer: Renderer): void {
		this.states.forEach(s => s.render(renderer));
	}
}
