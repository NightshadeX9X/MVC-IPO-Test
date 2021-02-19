import Input from "../core/Input.js";
import State from "../core/State.js";
import StateStack from "../core/StateStack.js";

class BlankState extends State {
	constructor(stateStack: StateStack) {
		super(stateStack);
	}

	update(input: Input) {
		this.subStateStack.update(input);
	}

	render(ctx: CanvasRenderingContext2D) {
		this.subStateStack.render(ctx);
	}
}

namespace BlankState {
	export async function create(stateStack: StateStack, customUpdate: State["update"] = (input) => { }) {
		const bs = new BlankState(stateStack);
		bs.update = (input) => {
			customUpdate(input);
			BlankState.prototype.update.call(bs, input);
		};
		await stateStack.push(bs);
		return bs;
	}
}

export default BlankState;