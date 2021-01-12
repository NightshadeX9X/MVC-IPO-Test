import Input from "../Input.js";
import Loader from "../Loader.js";
import State from "../State.js";

export default class RoamState extends State {
	private x = 30;
	private y = 50;
	async preload(loader: Loader) {

	}
	init(): void {

	}
	update(input: Input): void {
		this.x++;
	}
	render(ctx: CanvasRenderingContext2D): void {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.fillRect(this.x, this.y, 20, 20);
	}

}