import { generate2DArray } from "../../Util.js";
import GameMap from "../GameMap.js";
import Input from "../Input.js";
import Player from "../Player.js";
import Renderer from "../Renderer.js";
import Vector from "../Vector.js";
import State from "./State.js";
import StateStack from '../StateStack.js';

export default class RoamState extends State {
	public static gameMaps = new Map<string, GameMap>();
	public gameMapName = "the_square";
	private readonly INITIAL_PLAYER_POS = new Vector(18, 0);

	constructor(public stateStack: StateStack) {
		super(stateStack);
	}

	get currentMap() {
		return RoamState.gameMaps.get(this.gameMapName);
	}
	player = new Player(this, this.INITIAL_PLAYER_POS, new Vector(1, 2));

	async preload() {
		await this.loadCurrentMap();
	}
	async loadCurrentMap() {
		const map = this.currentMap;
		if (!map) return;
		if (map.img) return;
		map.preload();
	}
	update(input: Input): void {
		this.player.update(input);
	}
	render(renderer: Renderer): void {
		renderer.clear();

		if (this.currentMap) {

			this.currentMap.render(renderer);
		}
		this.player.render(renderer);

	}
}
RoamState.gameMaps.set('the_square', new GameMap('the_square', '../../../assets/images/maps/the-square.png', new Vector(40, 25), 16, generate2DArray(25, 40, "0", [
	{
		pos1: new Vector(0, 0),
		pos2: new Vector(3, 12),
		value: "1"
	},
	{
		pos1: new Vector(4, 0),
		pos2: new Vector(15, 2),
		value: "1"
	},
	{
		pos1: new Vector(0, 16),
		pos2: new Vector(3, 20),
		value: "1"
	},
	{
		pos1: new Vector(4, 3),
		pos2: new Vector(12, 12),
		value: "1"
	},
	{
		pos1: new Vector(24, 0),
		pos2: new Vector(39, 2),
		value: "1"
	},
	{
		pos1: new Vector(31, 3),
		pos2: new Vector(39, 12),
		value: "1"
	},
	{
		pos1: new Vector(19, 11),
		pos2: new Vector(21, 15),
		value: "1"
	},
	{
		pos1: new Vector(18, 12),
		pos2: new Vector(22, 14),
		value: "1"
	},
	{
		pos1: new Vector(13, 3),
		pos2: new Vector(14, 12),
		value: "2"
	},
	{
		pos1: new Vector(0, 13),
		pos2: new Vector(17, 15),
		value: "2"
	},
	{
		pos1: new Vector(18, 15),
		pos2: new Vector(18, 15),
		value: "2"
	},
	{
		pos1: new Vector(21, 17),
		pos2: new Vector(22, 23),
		value: "2"
	},
	{
		pos1: new Vector(23, 15),
		pos2: new Vector(24, 23),
		value: "2"
	},
	{
		pos1: new Vector(25, 8),
		pos2: new Vector(28, 23),
		value: "2"
	},
	{
		pos1: new Vector(29, 19),
		pos2: new Vector(30, 22),
		value: "2"
	},
])));
RoamState.gameMaps.set('test', new GameMap('test', '../../../assets/images/maps/test.png', new Vector(40, 25), 16, generate2DArray(25, 40, "0", [
	{
		pos1: new Vector(0, 0),
		pos2: new Vector(0, 5),
		value: "1"
	},
	{
		pos1: new Vector(1, 5),
		pos2: new Vector(5, 5),
		value: "1"
	},
	{
		pos1: new Vector(5, 6),
		pos2: new Vector(5, 12),
		value: "1"
	},
	{
		pos1: new Vector(6, 12),
		pos2: new Vector(10, 12),
		value: "1"
	},
	{
		pos1: new Vector(10, 8),
		pos2: new Vector(10, 11),
		value: "1"
	},
	{
		pos1: new Vector(11, 8),
		pos2: new Vector(16, 8),
		value: "1"
	},
	{
		pos1: new Vector(16, 9),
		pos2: new Vector(16, 17),
		value: "1"
	},
	{
		pos1: new Vector(17, 17),
		pos2: new Vector(22, 17),
		value: "1"
	},
	{
		pos1: new Vector(22, 18),
		pos2: new Vector(28, 18),
		value: "1"
	},
	{
		pos1: new Vector(35, 0),
		pos2: new Vector(35, 14),
		value: "1"
	},
	{
		pos1: new Vector(34, 14),
		pos2: new Vector(34, 18),
		value: "1"
	},
])));
