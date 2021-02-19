import RoamState from "../states/RoamState.js";
import Input from "./Input.js";
import Loader from "./Loader.js";
import StateStack from "./StateStack.js";

export default class Game {
	public fps = 60;
	public loader = new Loader();
	public input = new Input();
	public cnv = document.getElementById('screen') as HTMLCanvasElement;
	public ctx = this.cnv.getContext('2d') as CanvasRenderingContext2D;
	public stateStack = new StateStack(this, this);
	public readonly debug = true;

	public get cheatMode() {
		return this.debug && this.input.specialKeys.CTRL;
	}

	constructor() {
		this.ctx.imageSmoothingEnabled = false;
	}

	public async preload() {

		await this.stateStack.push(new RoamState(this.stateStack));
		this.input.start(document);

	}
	public update() {
		this.stateStack.update(this.input);
	}
	public render() {
		this.stateStack.render(this.ctx);
	}
}