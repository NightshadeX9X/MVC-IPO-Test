import Input from "../core/Input.js";
import Loader from "../core/Loader.js";
import State from "../core/State.js";

export default class RoamState extends State {
	async preload(loader: Loader) {
		await this.subStateStack.preload(loader);
	}
	update(input: Input): void {
		this.subStateStack.update(input);
	}
	render(ctx: CanvasRenderingContext2D): void {
		this.subStateStack.render(ctx);
	}
}