import Entity from "../interfaces.js";
import State from "./State.js";

export default class StateStack implements Entity {
	public states: State[] = [];

	/**
	 * Preloads the state, executes the init function of that state, and then adds it to the `this.states`.
	 *
	 * @memberof StateStack
	 */
	async push(s: State) {
		await s.preload();
		s.init();
		this.states = [...this.states, s];
	}

	pop() {
		return this.states.pop();
	}

	/**
	 * Returns the top state from the stack if no argument provided. If an argument is provided, the nth state from the top (where n is that argument) is returned.
	 *
	 */
	top(nthFromTop = 0) {
		return this.states[this.states.length - (1 + nthFromTop)];
	}

	/**
	 * Returns the bottom state from the stack if no argument provided. If an argument is provided, the nth state from the bottom (where n is that argument) is returned.
	 *
	 */
	bottom(nthFromBottom = 0) {
		return this.states[nthFromBottom];
	}

	async preload() {
		for (const s of this.states) {
			await s.preload();
		}
	}

	init() {
		this.states.forEach(s => s.init());
	}

	update() {
		this.states.forEach(s => {
			if (s.forceUpdate === false) return;
			if (s.forceUpdate === true) s.update();
			if (s === this.top()) s.update();
		})
	}

	render() {
		this.states.forEach(s => {
			if (s.toRender === false) return;
			s.update();
		})
	}

}