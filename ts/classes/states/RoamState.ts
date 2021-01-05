import { Direction } from "../../Util.js";
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
		map.load();
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

/*
GameMaps will have an imgUrl, width, height, tileData, and interactable. An interactable is an interface that a player can interact with, like a note on a table.

Interactables will have activation points, from where they can be activated. An activation point includes an pos Vector and directions that the player must face to activate the Interactables. Interactables will also have the text that will be displayed upon interaction.
*/
export class GameMap {
	img: HTMLImageElement | undefined = undefined;
	constructor(public name: string, public imgUrl: string, public sizeInTiles: Vector, public tileSizeInPx = 16) { }

	async load(): Promise<HTMLImageElement | void> {
		return new Promise((res) => {
			const image = new Image();
			image.addEventListener('load', e => {
				this.img = image;
				res(image);
			})
			image.src = this.imgUrl;
		})
	}

	render(renderer: Renderer) {
		if (!this.img) return;
		renderer.ctx.drawImage(this.img, 0, 0);
	}
}

RoamState.gameMaps.set('test', new GameMap('test', '../../../assets/images/maps/test.png', new Vector(40, 25)));

