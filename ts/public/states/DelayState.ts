import Input from "../core/Input.js";
import State from "../core/State.js";
import StateStack from "../core/StateStack.js";

export default class DelayState extends State {
	public elapsedFrames = 0;
	constructor(public stateStack: StateStack, public totalFrames: number) {
		super(stateStack);
	}
	update(input: Input) {
		if (this.remainingFrames <= 0) {
			this.stateStack.pop();
		}
		this.elapsedFrames++;

	}

	public get remainingFrames() {
		return this.totalFrames - this.elapsedFrames;
	}
}