import EncounterTable from "../../JSONConversions/EncounterTable.js";
import { chance, Direction, directionToVector } from "../../Util.js";
import Input from "../Input.js";
import Loader from "../Loader.js";
import { GrassLayer } from "../map_layers/GrassLayer.js";
import { PortalLayer } from "../map_layers/PortalLayer.js";
import State from "../State.js";
import StateStack from "../StateStack.js";
import Vector from "../Vector.js";
import BlankState from "./Blank.js";
import FadeState from "./FadeState.js";
import RoamState from "./RoamState.js";
import WildBattleState from "./WildBattleState.js";

export default class PlayerMovingState extends State {
	private frames = 0;
	private playerOriginalPos = new Vector();
	constructor(public stateStack: StateStack, public roamState: RoamState, public direction: Direction) {
		super(stateStack);
	}
	async preload(loader: Loader) {

	}
	init(): void {
		this.roamState.toUpdate = true;
		this.playerOriginalPos = Vector.from(this.roamState.player.pos);
		if (this.roamState.player.spritesheet) {
			if (this.direction === Direction.DOWN)
				this.roamState.player.spritesheet.coords.y = 0
			else if (this.direction === Direction.LEFT)
				this.roamState.player.spritesheet.coords.y = 1
			else if (this.direction === Direction.RIGHT)
				this.roamState.player.spritesheet.coords.y = 2
			else if (this.direction === Direction.UP)
				this.roamState.player.spritesheet.coords.y = 3
		}

		const destination = this.targetCoords;
		const wallData = this.roamState.gameMap.layers.get('wall')?.getData();

		if (this.roamState.gameMap.json && wallData) {
			if (
				destination.x < 0 ||
				destination.y < 0 ||
				destination.x >= this.roamState.gameMap.size.x ||
				destination.y >= this.roamState.gameMap.size.y ||
				wallData[destination.y]?.[destination.x]
			) {
				this.stateStack.pop();
			}
		}

	}
	private get vec() {
		return directionToVector(this.direction).quo(this.roamState.tileSize);
	}
	private get targetCoords() {
		return this.playerOriginalPos.sum(directionToVector(this.direction));
	}
	update(input: Input): void {
		const spritesheet = this.roamState.player.spritesheet;
		if (this.frames < 16) {

			if (spritesheet && this.frames % 4 === 0) {

				spritesheet.coords.x = (spritesheet.coords.x + 1) % (spritesheet.spriteCount.x * spritesheet.size.x);
			}
			this.roamState.player.spritesheet?.coords
			this.roamState.player.pos.add(this.vec);
		} else {

			(async () => {

				this.roamState.player.pos = this.targetCoords;

				let encounterTable = "";
				const grassData = (this.roamState.gameMap.layers.get('grass') as GrassLayer)?.getData();
				if (grassData) {
					const tile = grassData[this.targetCoords.y][this.targetCoords.x];
					if (tile && chance(100)) {
						console.log("tile is truthy")
						encounterTable = tile.table;
						// toPushWildBattle = true;
					}
				}
				this.roamState.toUpdate = null;
				this.stateStack.pop();
				if (encounterTable && this.stateStack.game.party.usable()) {
					const wbs = new WildBattleState(this.stateStack, "meadow", encounterTable);
					this.stateStack.push(wbs)
					this.stateStack.push(new FadeState(this.stateStack));
					return;
				}


				// --------------------------- PORTAL
				const portalData = (this.roamState.gameMap.layers.get('portal') as PortalLayer)?.data
				if (portalData) {
					const tile = portalData[this.targetCoords.y]?.[this.targetCoords.x];
					if (tile) {
						console.log("portal code running")
						const [map, posStr] = tile.to.split(" ");
						const pos = Vector.fromString(posStr);
						this.roamState.player.pos = pos;
						this.roamState.gameMap.name = map;
						this.stateStack.push(new BlankState(this.stateStack));
						await this.roamState.gameMap.preload(this.stateStack.loader);
						this.stateStack.pop();
					}
				}
			})()
		}

		this.frames++;
	}
	render(ctx: CanvasRenderingContext2D): void {

	}



}