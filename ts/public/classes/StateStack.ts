import { Entity } from "../Util.js";
import Input from "./Input.js";
import Loader from "./Loader.js";
import Renderer from "./Renderer.js";
import RoamState from "./states/RoamState.js";
import State from "./states/State.js";

export default class StateStack implements Entity {
	public states: State[] = [];

	constructor(public loader: Loader) {
		this.push(new RoamState(this, this.loader));
	}

	async push(s: State) {
		this.states.push(s);
		await this.top?.preload(this.loader)
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
	async preload(loader: Loader) {
		this.loader = loader;
		for await (let s of this.states) {
			await s.preload(loader);
		}
	}
	update(input: Input): void {

		this.states.filter(s => s.forceUpdate || s === this.top).forEach(s => s.update(input));
	}
	render(renderer: Renderer): void {
		this.states.forEach(s => s.render(renderer));
	}
}
