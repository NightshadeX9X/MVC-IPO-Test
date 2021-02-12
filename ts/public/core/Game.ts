import RoamState from "../states/RoamState.js";
import Input from "./Input.js";
import Loader from "./Loader.js";
import StateStack from "./StateStack.js";

export default class Game {
	fps = 1;
	loader = new Loader();
	input = new Input();
	cnv = document.getElementById('screen') as HTMLCanvasElement;
	ctx = this.cnv.getContext('2d') as CanvasRenderingContext2D;
	stateStack = new StateStack(this, this);

	async preload() {
		await this.stateStack.push(new RoamState(this.stateStack));
		// await this.stateStack.preload(this.loader);

	}
	update() {
		this.stateStack.update(this.input);
	}
	render() {
		this.stateStack.render(this.ctx);
	}
}