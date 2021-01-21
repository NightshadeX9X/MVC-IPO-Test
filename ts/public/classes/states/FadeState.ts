import Input from "../Input.js";
import Loader from "../Loader.js";
import State from "../State.js";

export default class FadeState extends State {
	private alpha = 0;
	private part = FadeStatePart.ASCENDING;
	private amount = 0.03;
	async preload(loader: Loader) {

	}
	init(): void {

	}
	update(input: Input): void {
		if (this.part === FadeStatePart.ASCENDING) {

			this.alpha += this.amount;

			if (this.alpha >= 1) this.part = FadeStatePart.DESCENDING
		} else if (this.part === FadeStatePart.DESCENDING) {
			this.alpha -= this.amount;

			if (this.alpha <= 0) this.part = FadeStatePart.ENDED
		} else if (this.part === FadeStatePart.ENDED) {
			this.stateStack.pop();
		}
	}
	render(ctx: CanvasRenderingContext2D): void {
		ctx.save();
		ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.restore();
	}
}
enum FadeStatePart {
	ASCENDING,
	DESCENDING,
	WAITING,
	ENDED
}