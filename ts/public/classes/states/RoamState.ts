import { Direction, generate2DArray } from "../../Util.js";
import GameMap, { JSONMap } from "../GameMap.js";
import Input from "../Input.js";
import Player from "../Player.js";
import Renderer from "../Renderer.js";
import Vector from "../Vector.js";
import State from "./State.js";
import StateStack from '../StateStack.js';
import Loader from "../Loader.js";
import { getSaveData } from '../../SaveData.js';

export default class RoamState extends State {
	public static gameMaps = new Map<string, GameMap>();
	private readonly INITIAL_PLAYER_POS = getSaveData().pos;

	constructor(public stateStack: StateStack, public loader: Loader, public gameMapName = getSaveData().currentMap) {
		super(stateStack);
	}

	get currentMap() {
		return RoamState.gameMaps.get(this.gameMapName);
	}
	player = new Player(this, this.INITIAL_PLAYER_POS, new Vector(1, 2));

	async preload(loader: Loader) {
		await this.loadCurrentMap();
		await this.player.preload(loader);
	}
	async loadCurrentMap() {

		console.group("RoamState.prototype.loadCurrentMap")
		const maps = await this.loader.json('/json/maps.json') as JSONMap[];
		const mapJson = maps.find(m => m.name === this.gameMapName);

		if (!mapJson) return;
		const args = mapJson.tileDataGeneratorArgs;

		const map = new GameMap(this, mapJson.name, mapJson.imageUrl, new Vector(mapJson.sizeInTiles.x, mapJson.sizeInTiles.y), mapJson.tileSizeInPx, generate2DArray(args.rows, args.columns, args.defaultString, args.overrides.map(o => ({ value: o.value, pos1: new Vector(o.pos1.x, o.pos1.y), pos2: new Vector(o.pos2.x, o.pos2.y) }))), (args.additionalTileDataMappings || {}));


		if (!map) return;
		RoamState.gameMaps.set(this.gameMapName, map);

		if (map.img) return;
		await map.preload(this.loader);
		console.groupEnd()
	}
	update(input: Input): void {
		this.player.update(input);


	}
	render(renderer: Renderer): void {

		renderer.clear();

		renderer.ctx.save();
		renderer.ctx.fillStyle = "#d7e3ff";
		renderer.ctx.fillRect(0, 0, 640, 400);
		renderer.ctx.restore();
		if (this.currentMap) {

			this.currentMap.render(renderer);
		}
		this.player.render(renderer);

	}
}
