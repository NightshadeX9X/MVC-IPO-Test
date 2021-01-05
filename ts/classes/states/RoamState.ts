import { Direction, Entity } from "../../Util.js";
import GameMap from "../GameMap.js";
import Player from "../Player.js";
import Renderer from "../Renderer.js";
import Vector from "../Vector.js";
import State from "./State.js";

export default class RoamState extends State {
	public static gameMaps = new Map<string, GameMap>();
	public gameMapName = "test";
	private readonly INITIAL_PLAYER_POS = new Vector(50, 50);

	constructor() {
		super();
	}

	get currentMap() {
		return RoamState.gameMaps.get(this.gameMapName);
	}
	player = new Player(this, this.INITIAL_PLAYER_POS, new Vector(30, 20));

	async preload() {
		await this.loadCurrentMap();
	}
	async loadCurrentMap() {
		const map = this.currentMap;
		if (!map) return;
		if (map.img) return;
		map.preload();
	}
	update(): void {
		this.player.update();
	}
	render(renderer: Renderer): void {
		renderer.clear();

		if (this.currentMap) {

			this.currentMap.render(renderer);
		}


		this.player.render(renderer);
	}
}

RoamState.gameMaps.set('test', new GameMap('test', '../../../assets/images/maps/test.png', new Vector(40, 25)));

