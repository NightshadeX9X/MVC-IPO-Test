import Input from "../Input.js";
import Loader from "../Loader.js";
import State from "../State.js";
import StateStack from "../StateStack.js";

export default class BlankState extends State {
	constructor(public stateStack: StateStack) {
		super(stateStack);
	}

	async preload(loader: Loader) {

	}
	init(): void {

	}
	update(input: Input): void {
		this.substates.update(input);

	}
	render(ctx: CanvasRenderingContext2D): void {
		this.substates.render(ctx);
	}

}