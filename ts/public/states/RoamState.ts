import Input from "../core/Input.js";
import Loader from "../core/Loader.js";
import State from "../core/State.js";
import GameMap from "../roam_state/GameMap.js";
import Player from "../roam_state/Player.js";

export default class RoamState extends State {
	player = new Player(this);
	gameMap = new GameMap(this, 'route5');
	async preload(loader: Loader) {
		await Promise.all([
			this.player.preload(loader),
			this.gameMap.preload(loader),
		])
	}
	update(input: Input): void {
		this.player.update(input)
	}
	render(ctx: CanvasRenderingContext2D): void {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

		const entities = this.getEntities();
		const sortedEntities = entities.sort((a, b) => a.zIndex - b.zIndex);
		sortedEntities.forEach(entity => {
			entity.render(ctx);
		});
	}
	private getEntities() {
		return [
			this.player,
			...this.gameMap.layers
		]
	}
}