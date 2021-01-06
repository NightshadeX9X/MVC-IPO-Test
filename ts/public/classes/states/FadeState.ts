import Input from "../Input.js";
import Loader from "../Loader.js";
import Renderer from "../Renderer.js";
import State from "./State.js";
import StateStack from '../StateStack.js';

export class FadeState extends State {
	private alpha = 0;
	private ascending = true;
	private shouldEnd = false;
	private ended = false;
	private alphaIncrement = 0.01;
	constructor(public stateStack: StateStack, public r = 255, public g = r, public b = r) {
		super(stateStack);

	}
	async preload(loader: Loader) {

	}
	update(): void {

		if (!this.ended && this.alpha <= 1 && this.ascending) {
			this.alpha += this.alphaIncrement;
			if (this.alpha >= 1) { this.ascending = false; this.alpha = 1; }
		}
		this.updateFunc();
	}
	updateFunc: Function = () => { return }
	end() {
		// return Promise.resolve(0)
		// this.shouldEnd = true;
		return new Promise((res, rej) => {
			this.updateFunc = () => {
				this.alpha -= this.alphaIncrement;
				if (this.alpha <= 0) {
					this.stateStack.pop();
					res(0);
				}
			}
		})
	}
	render(renderer: Renderer): void {
		renderer.ctx.save();
		renderer.ctx.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.alpha})`;
		renderer.ctx.fillRect(0, 0, 640, 400);
		renderer.ctx.restore();
	}

}