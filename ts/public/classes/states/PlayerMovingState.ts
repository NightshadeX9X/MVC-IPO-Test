import Input from '../Input.js';
import Renderer from '../Renderer.js';
import State from './State.js';
import StateStack from '../StateStack.js';
import Player from '../Player.js';
import { delay, Direction, directionToVector } from '../../Util.js';
import { fps } from '../../index.js';
import Vector from '../Vector.js';
import { chance } from '../../Util.js';
import RoamState from './RoamState.js';
import { FadeState } from './FadeState.js';
export default class PlayerMovingState extends State {
	timesUpdated = 0;
	originalPos: Vector;
	toMove = true;
	constructor(public stateStack: StateStack, public player: Player, public tilesToMovePlayer = 1) {
		super(stateStack);
		console.log(this.player)
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

		if (headedToTile?.type === "wall" || headedToTilePos.x <= -1 || headedToTilePos.y <= -1 || headedToTilePos.x > 40 || headedToTilePos.y > 25) {
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
			if (headedToTile?.type !== "portal")
				this.stateStack.pop();

		}
		if (this.timesUpdated === 0) {
			this.player.spriteSheetCords.x = 0
		} else if (this.timesUpdated === 4) {
			this.player.spriteSheetCords.x = 1
		} else if (this.timesUpdated === 8) {
			this.player.spriteSheetCords.x = 2
		} else if (this.timesUpdated === 12) {
			this.player.spriteSheetCords.x = 3
		}

		if (headedToTile?.type === "grass") {
			console.log("in grass");
			if (chance(1, 10)) {
				console.log("WILD ENCOUNTER!!")
			}
		}

		if (headedToTile?.type === "portal") {

			const fadeState = new FadeState(this.stateStack);
			this.stateStack.push(fadeState);

			(async () => {

				console.log(headedToTile)

				if (headedToTile.delay)
					await delay(headedToTile.delay)
				this.player.roamState.gameMapName = headedToTile.to.mapName;
				this.player.pos = headedToTile.to.pos;
				console.log(this.player)
				if (headedToTile.to.direction) {
					this.player.facing = headedToTile.to.direction;
				}
				await this.player.roamState.preload(this.stateStack.loader)
				await fadeState.end()
				console.log(this.player)

				this.stateStack.pop();
			})()
		}

		this.timesUpdated++;
	}
	render(renderer: Renderer): void {

	}

}