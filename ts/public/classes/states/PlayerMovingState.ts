import Input from '../Input.js';
import Renderer from '../Renderer.js';
import State from './State.js';
import StateStack from '../StateStack.js';
import Player from '../Player.js';
import { Direction } from '../../Util.js';
import { fps } from '../../index.js';
import Vector from '../Vector.js';
export default class PlayerMovingState extends State {
	timesUpdated = 0;
	originalPos: Vector;
	constructor(public stateStack: StateStack, public player: Player, public tilesToMovePlayer = 1) {
		super(stateStack);
		this.originalPos = new Vector(player.pos.x, player.pos.y);
	}
	async preload() { }

	update(input: Input): void {
		const fraction = this.tilesToMovePlayer / (this.player.roamState.currentMap?.tileSizeInPx || 16)
		if (this.timesUpdated < 15) {

			if (this.player.facing === Direction.LEFT) {
				this.player.pos = this.player.pos.add(new Vector(-fraction, 0).multiply(this.player.speed));
			} else if (this.player.facing === Direction.UP) {
				this.player.pos = this.player.pos.add(new Vector(0, -fraction).multiply(this.player.speed));
			} else if (this.player.facing === Direction.RIGHT) {
				this.player.pos = this.player.pos.add(new Vector(fraction, 0).multiply(this.player.speed));
			} else if (this.player.facing === Direction.DOWN) {
				this.player.pos = this.player.pos.add(new Vector(0, fraction).multiply(this.player.speed));
			}
		} else {
			if (this.player.facing === Direction.LEFT) {
				this.player.pos = this.originalPos.add(new Vector(-this.player.speed.x, 0));
			} else if (this.player.facing === Direction.UP) {
				this.player.pos = this.originalPos.add(new Vector(0, -this.player.speed.y));
			} else if (this.player.facing === Direction.RIGHT) {
				this.player.pos = this.originalPos.add(new Vector(this.player.speed.x, 0));
			} else if (this.player.facing === Direction.DOWN) {
				this.player.pos = this.originalPos.add(new Vector(0, this.player.speed.y));
			}

			this.stateStack.pop();
		}

		this.timesUpdated++;
	}
	render(renderer: Renderer): void {

	}

}