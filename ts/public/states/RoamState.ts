import Input from "../core/Input.js";
import Loader from "../core/Loader.js";
import State from "../core/State.js";
import Camera from "../roam_state/Camera.js";
import GameMap from "../roam_state/GameMap.js";
import GameMapLayer from "../roam_state/GameMapLayer.js";
import Player from "../roam_state/Player.js";

export default class RoamState extends State {
	public player = new Player(this);
	public gameMap = new GameMap(this, 'route5');
	public camera = new Camera(this);
	public tileSize = 16;
	public async preload(loader: Loader) {
		await Promise.all([
			this.player.preload(loader),
			this.gameMap.preload(loader),
		])
	}
	private getEntityZIndexPriority(entity: Player | GameMapLayer) {
		if (entity instanceof Player) return 1;
		return 0;
	}
	public update(input: Input): void {
		this.player.update(input)
		this.camera.update()
	}
	public render(ctx: CanvasRenderingContext2D): void {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

		const entities = this.getEntities();
		const sortedEntities = entities.sort((a, b) => {
			if (a.zIndex !== b.zIndex)
				return a.zIndex - b.zIndex;
			if (a.pos.y !== b.pos.y)
				return a.pos.y - b.pos.y;

			return this.getEntityZIndexPriority(a) - this.getEntityZIndexPriority(b)
		});
		sortedEntities.forEach(entity => {
			entity.render(ctx);
		});

		/////////
		this.camera.render(ctx);

	}
	private getEntities() {
		return [
			this.player,
			...this.gameMap.layers
		]
	}
}