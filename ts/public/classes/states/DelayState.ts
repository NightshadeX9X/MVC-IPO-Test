import Input from "../Input.js";
import Loader from "../Loader.js";
import State from "../State.js";
import StateStack from "../StateStack.js";

export default class DelayState extends State {
	public frames = 0;
	constructor(public stateStack: StateStack, public totalFrames: number) {
		super(stateStack);
	}

	async preload(loader: Loader) {

	}
	init(): void {

	}
	update(input: Input): void {
		if (this.frames >= this.totalFrames) {
			this.stateStack.pop();
			return;
		}
		this.frames++;
	}
	render(ctx: CanvasRenderingContext2D): void {

	}

}