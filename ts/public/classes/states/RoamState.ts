import Input from "../Input.js";
import Loader from "../Loader.js";
import State from "../State.js";
import Vector from "../Vector.js";

export default class RoamState extends State {
	private pos = new Vector(30, 40);
	async preload(loader: Loader) {

	}
	init(): void {

	}
	update(input: Input): void {
		this.pos.add(1);
	}
	render(ctx: CanvasRenderingContext2D): void {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.fillRect(this.pos.x, this.pos.y, 20, 20);
	}

}