import Input from "../core/Input.js";
import Loader from "../core/Loader.js";
import State from "../core/State.js";
import Camera from "../roam_state/Camera.js";
import GameMap from "../roam_state/GameMap.js";
import GameMapLayer from "../roam_state/GameMapLayer.js";
import GameObject from "../roam_state/GameObject.js";
import Player from "../roam_state/Player.js";
import Dictionairy from "../util/Dictionairy.js";
import { ChildClass } from "../util/functions.js";

export default class RoamState extends State {
	public player = new Player(this);
	public gameMap = new GameMap(this, 'route5');
	public camera = new Camera(this);
	public tileSize = 16;
	public gameObjects = new Dictionairy<string, GameObject>();

	public async preload(loader: Loader) {
		await Promise.all([
			this.player.preload(loader),
			this.gameMap.preload(loader),
		]);
		await this.loadGameObjects(loader);

		console.log(this.gameObjects)
	}

	private async loadGameObjects(loader: Loader) {
		const toLoad = this.gameMap.json?.gameObjects;
		if (!toLoad || toLoad.length === 0) return;
		const promises = toLoad.map(name => {
			return loader.loadJS<{ default: ChildClass<typeof GameObject> }>(`/js/roam_state/game_objects/${this.gameMap.name}/${name}.js`);
		});
		const results = (await Promise.all(promises)).map(r => r.default);
		for (const result of results) {
			this.gameObjects.set(result.name, new result(this));
		}

		await Promise.all(this.gameObjects.toArray().map(go => go.preload(loader)))
	}

	private getEntityZIndexPriority(entity: Player | GameMapLayer | GameObject) {
		if (entity instanceof Player || entity instanceof GameObject) return 1;
		return 0;
	}
	public update(input: Input): void {
		this.player.update(input)
		this.camera.update();
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
			...this.gameMap.layers,
			...(this.gameObjects.toArray())
		]
	}
}