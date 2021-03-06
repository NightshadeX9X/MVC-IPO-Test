import Direction from "../util/Direction.js";
import Events from "../util/Events.js";
import { New } from "../util/functions.js";

interface Input {
	evtHandler: Events.Handler;
	preventDefault: boolean;
	specialKeys: {
		CTRL: boolean,
		SHIFT: boolean,
		ALT: boolean
	}
}
class Input {
	private static keyDownSymbol = Symbol('key down');
	private static keyUpSymbol = Symbol('key up');
	private keyStates = new Map<string, typeof Input.keyDownSymbol | typeof Input.keyUpSymbol>();
	evtHandler = new Events.Handler();
	specialKeys = {
		CTRL: false,
		SHIFT: false,
		ALT: false
	}
	preventDefault = true;
	constructor() {

	}
	public start(el: Document | HTMLElement) {
		el.addEventListener('keydown', e => {
			if (this.preventDefault)
				e.preventDefault();
			if (!this.keyIsDown((e as KeyboardEvent).key)) {
				this.evtHandler.dispatchEvent('keypress', e)
			}
			this.keyStates.set((e as KeyboardEvent).key, Input.keyDownSymbol);
			this.updateSpecialKeys(e as KeyboardEvent);
		})

		el.addEventListener('keyup', e => {
			if (this.preventDefault)
				e.preventDefault();
			if (this.keyIsDown((e as KeyboardEvent).key)) {
				this.evtHandler.dispatchEvent('keyrelease', e)
			}
			this.keyStates.set((e as KeyboardEvent).key, Input.keyUpSymbol);
			this.updateSpecialKeys(e as KeyboardEvent);
		})
	}

	private updateSpecialKeys(e: KeyboardEvent) {
		this.specialKeys.SHIFT = e.shiftKey;
		this.specialKeys.ALT = e.altKey;
		this.specialKeys.CTRL = e.ctrlKey;
	}

	public keyIsDown(key: string) {
		return this.keyStates.get(key) === Input.keyDownSymbol;
	}

	public get directionKeyStates() {
		const states: Record<Direction.AsString, boolean> = {
			UP: false,
			LEFT: false,
			RIGHT: false,
			DOWN: false,
		};
		this.keyStates.forEach((symbol, key) => {
			if (symbol === Input.keyUpSymbol) return;
			if (key === "w" || key === "ArrowUp") states.UP = true;
			if (key === "a" || key === "ArrowLeft") states.LEFT = true;
			if (key === "s" || key === "ArrowDown") states.DOWN = true;
			if (key === "d" || key === "ArrowRight") states.RIGHT = true;
		})

		return states;
	}

	public get interactionKey() {
		return this.keyIsDown(' ') || this.keyIsDown('Enter')
	}

	public get escapeKey() {
		return this.keyIsDown('Escape') || this.keyIsDown('Return');
	}
}

export default Input;