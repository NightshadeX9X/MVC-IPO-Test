import Input from '../Input.js';
import Renderer from '../Renderer.js';
import State from './State.js';
import StateStack from '../StateStack.js';
import Player from '../Player.js';
import { Direction, directionToVector } from '../../Util.js';
import { fps } from '../../index.js';
import Vector from '../Vector.js';
import { chance } from '../../Util.js';
export default class PlayerMovingState extends State {
	timesUpdated = 0;
	originalPos: Vector;
	toMove = true;
	constructor(public stateStack: StateStack, public player: Player, public tilesToMovePlayer = 1) {
		super(stateStack);
		this.originalPos = new Vector(player.pos.x, player.pos.y);
		this.preload();
	}
	async preload() {
	}

	update(input: Input): void {
		if (!this.player.roamState.currentMap?.tileDataMapped) return;
		const inFront = directionToVector(this.player.facing).multiply(this.player.speed);
		const headedToTilePos = this.player.pos.add(inFront);
		const headedToRow = this.player.roamState.currentMap.tileDataMapped[headedToTilePos.y];
		const headedToTile = headedToRow?.[headedToTilePos.x];
		// console.log({ x: inFront.x, y: inFront.y })

		if (headedToTile?.type === "wall" || headedToTilePos.x <= -1 || headedToTilePos.y <= -1 || headedToTilePos.x > 40 || headedToTilePos.y > 35) {
			this.toMove = false;
			this.stateStack.pop();
			return;
		}
		if (!this.toMove) return;

		const fraction = this.tilesToMovePlayer / (this.player.roamState.currentMap?.tileSizeInPx || 16)
		if (this.timesUpdated < 15) {

			this.player.pos = this.player.pos.add(directionToVector(this.player.facing).multiply(fraction).multiply(this.player.speed));
		} else {
			this.player.pos = this.originalPos.add(directionToVector(this.player.facing).multiply(this.player.speed)).round()
			this.timesUpdated = 0;
			// console.log(this.player.pos)
			this.stateStack.pop();
		}

		if (headedToTile?.type === "grass") {
			console.log("in grass");
			if (chance(1, 10)) {
				console.log("WILD ENCOUNTER!!")
			}
		}

		this.timesUpdated++;
	}
	render(renderer: Renderer): void {

	}

}