import GameMap from "../GameMap.js";
import Input from "../Input.js";
import Loader from "../Loader.js";
import State from "../State.js";
import Vector from "../Vector.js";

export default class RoamState extends State {
	public gameMap = new GameMap('player_bedroom', this);
	async preload(loader: Loader) {
		await this.gameMap.preload(loader);
	}
	init(): void {

	}
	update(input: Input): void {

	}
	render(ctx: CanvasRenderingContext2D): void {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		this.gameMap.render(ctx);
	}

}