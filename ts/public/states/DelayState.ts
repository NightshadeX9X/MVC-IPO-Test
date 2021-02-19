import Input from "../core/Input.js";
import State from "../core/State.js";
import StateStack from "../core/StateStack.js";

class DelayState extends State {
	public elapsedFrames = 0;
	constructor(public stateStack: StateStack, public totalFrames: number) {
		super(stateStack);
	}
	public update(input: Input) {
		if (this.remainingFrames <= 1) {
			this.stateStack.pop();
		}
		this.elapsedFrames++;

	}

	public get remainingFrames() {
		return this.totalFrames - this.elapsedFrames;
	}
}

namespace DelayState {
	export async function create(stateStack: StateStack, frames: number) {
		const ds = new DelayState(stateStack, frames);
		await stateStack.push(ds);
		await ds.pop();
	}
}

export default DelayState;