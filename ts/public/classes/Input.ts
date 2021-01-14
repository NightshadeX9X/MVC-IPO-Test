import { Direction } from "../Util.js";

export default class Input {
	private static keyDownSymbol = Symbol('key down');
	private static keyUpSymbol = Symbol('key up');
	private keyStates = new Map<string, typeof Input.keyDownSymbol | typeof Input.keyUpSymbol>()

	public start(el: Document | HTMLElement) {
		el.addEventListener('keydown', e => {
			e.preventDefault();
			this.keyStates.set((e as KeyboardEvent).key, Input.keyDownSymbol);
			// console.log("keydown", this.keyStates.get((e as KeyboardEvent).key))

		})

		el.addEventListener('keyup', e => {
			e.preventDefault();
			this.keyStates.set((e as KeyboardEvent).key, Input.keyUpSymbol);
			// console.log("keyup", this.keyStates.get((e as KeyboardEvent).key))
		})
	}

	public keyIsDown(key: string) {
		return this.keyStates.get(key) === Input.keyDownSymbol;
	}

	public get directionKeyStates() {
		const states: Record<keyof typeof Direction, boolean> = {
			UP: false,
			LEFT: false,
			RIGHT: false,
			DOWN: false,
		};
		this.keyStates.forEach((symbol, key) => {
			if (symbol === Input.keyUpSymbol) return;
			if (key === "W" || key === "ArrowUp") states.UP = true;
			if (key === "A" || key === "ArrowLeft") states.LEFT = true;
			if (key === "S" || key === "ArrowDown") states.DOWN = true;
			if (key === "D" || key === "ArrowRight") states.RIGHT = true;
		})

		return states;
	}
}