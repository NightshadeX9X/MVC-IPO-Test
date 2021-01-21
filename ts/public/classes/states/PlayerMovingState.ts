import { chance, Direction, directionToVector } from "../../Util.js";
import Input from "../Input.js";
import Loader from "../Loader.js";
import State from "../State.js";
import StateStack from "../StateStack.js";
import Vector from "../Vector.js";
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
		let wd = this.roamState.gameMap.wallData;
		if (wd && this.roamState.gameMap.json) {
			if (wd[this.targetCoords.y]?.[this.targetCoords.x] === true ||
				this.targetCoords.x < 0 ||
				this.targetCoords.x >= this.roamState.gameMap.json.sizeInTiles.x ||
				this.targetCoords.y < 0 ||
				this.targetCoords.y >= this.roamState.gameMap.json.sizeInTiles.y
			) {
				this.stateStack.pop();
				return;
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
				if (this.roamState.gameMap.portalData) {
					const portalTo = this.roamState.gameMap.portalData?.[this.targetCoords.y]?.[this.targetCoords.x];
					if (portalTo) {
						this.roamState.gameMap.name = portalTo.map;
						this.roamState.gameMap.load(this.stateStack.loader);
						this.roamState.player.pos = portalTo.pos
					}
				}
				let toPushWildBattle = false;

				if (this.roamState.gameMap.grassData) {
					const grassTo = this.roamState.gameMap.grassData?.[this.targetCoords.y]?.[this.targetCoords.x];
					if (grassTo) {
						console.log("in grass")
						if (chance(70))
							toPushWildBattle = true;
					}
				}

				// console.log(this.roamState.player.pos)
				this.roamState.toUpdate = null;
				this.stateStack.pop();
				if (toPushWildBattle) {
					const wbs = new WildBattleState(this.stateStack, "meadow");
					this.stateStack.push(wbs)
					this.stateStack.push(new FadeState(this.stateStack));
				}
			})()
		}

		this.frames++;
	}
	render(ctx: CanvasRenderingContext2D): void {

	}



}