import { Direction } from "../Util.js";

export default class Input {
	private static keyDownSymbol = Symbol('key down');
	private static keyUpSymbol = Symbol('key up');
	private keyStates = new Map<string, typeof Input.keyDownSymbol | typeof Input.keyUpSymbol>()

	public start(el: Document | HTMLElement) {
		el.addEventListener('keydown', e => {
			e.preventDefault();
			this.keyStates.set((e as KeyboardEvent).key, Input.keyDownSymbol);
		})

		el.addEventListener('keyup', e => {
			e.preventDefault();
			this.keyStates.set((e as KeyboardEvent).key, Input.keyUpSymbol);
		})
	}

	public keyIsDown(key: string) {
		return this.keyStates.get(key) === Input.keyDownSymbol;
	}

	public get directionKeyStates() {
		const states: Partial<Record<keyof typeof Direction, boolean>> = {};
		this.keyStates.forEach((symbol, key) => {
			if (key === "W" || "ArrowUp") states.UP = true;
			else if (key === "A" || "ArrowLeft") states.LEFT = true;
			else if (key === "S" || "ArrowDown") states.DOWN = true;
			else if (key === "D" || "ArrowRight") states.RIGHT = true;
		})

		return states;
	}
}