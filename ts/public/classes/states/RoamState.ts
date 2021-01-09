import Controller from "../Controller.js";
import { GameMap } from "../GameMap.js";
import Loader from "../Loader.js";
import Player from "../Player.js";
import State from "../State.js";
import StateStack from "../StateStack.js";
import Tweener from "../Tweener.js";
import Vector from "../Vector.js";

export default class RoamState extends State {
	public tileSize = 16;
	public player = new Player(this);
	public gameMap = new GameMap(this, '/json/maps/the_square.json');

	constructor(stateStack: StateStack) {
		super(stateStack);
	}

	async preload(loader: Loader) {
		await this.gameMap.preload(loader);
	}
	init(): void {

	}
	update(controller: Controller): void {
		this.player.update(controller);
	}
	render(ctx: CanvasRenderingContext2D): void {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
		/* this.gameMap.render(ctx)
		ctx.font = "30px monospace";
		ctx.fillText("hello", 30, 50) */
		this.gameMap.render(ctx);
		this.player.render(ctx);
		this.player.camera.render(ctx);
	}

}