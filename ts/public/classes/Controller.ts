export default class Controller {
	constructor(private element: HTMLElement | Document) { }
	private keyDown = Symbol('key down');
	private keyUp = Symbol('key up');
	private keyStates = new Map<string, symbol>();

	start() {
		this.element.onkeydown = e => {
			this.keyStates.set(e.key, this.keyDown);
		};

		this.element.onkeyup = e => {
			this.keyStates.set(e.key, this.keyUp);
		};
	}

	keyIsDown(key: string) {
		return this.keyStates.get(key) === this.keyDown;
	}
}