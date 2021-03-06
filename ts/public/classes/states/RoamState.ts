
import GameMap from "../GameMap.js";
import Input from "../Input.js";
import Loader from "../Loader.js";
import Player from "../Player.js";
import State from "../State.js";
import StateStack from "../StateStack.js";
import Vector from "../Vector.js";
export default class RoamState extends State {
	public timeOfDay = TimeOfDay.NIGHT;
	public gameMap = new GameMap('the_square', this);
	public player = new Player(this);
	public tileSize = new Vector(16);
	constructor(public stateStack: StateStack) {
		super(stateStack);

	}
	async preload(loader: Loader) {
		await Promise.all(
			[
				this.gameMap.preload(loader),
				this.player.preload(loader)
			]);
	}
	init(): void {
		this.gameMap.init();
		this.player.init();
	}
	update(input: Input): void {
		this.player.update(input)
	}
	render(ctx: CanvasRenderingContext2D): void {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		this.player.camera.clear();
		this.gameMap.render(ctx);
		this.player.render(ctx);
		this.player.camera.render(ctx);


	}

}


enum TimeOfDay {
	NIGHT,
	DAY
}