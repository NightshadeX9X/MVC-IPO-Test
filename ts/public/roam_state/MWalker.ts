import DelayState from "../states/DelayState.js";
import RoamState from "../states/RoamState.js";
import Direction from "../util/Direction.js";
import Spritesheet from "../util/Spritesheet.js";
import Vector from "../util/Vector.js";
import Events from '../util/Events.js';
import { Mixin } from "../util/functions.js";

export default class MWalker {
	pos: Vector = null as any;
	spritesheet: Spritesheet | null = null;
	roamState: RoamState = null as any;
	evtHandler: Events.Handler = null as any;
	direction: Direction = null as any;
	zIndex: number = null as any;

	canWalkThroughWalls: boolean = false;
	canWalkThroughMapEdges: boolean = false;


	static construct(this: MWalker, imageUrl: string) {
		this.canWalkThroughWalls = false;
		this.canWalkThroughMapEdges = false;
	}

	private async loadImageAndSpritesheet() {

	}

	private async takeStep(direction: Direction) {
		const vector = Direction.toVector(direction)
		const createDelay = async () => {
			const delay = new DelayState(this.roamState.stateStack, 1);
			this.roamState.stateStack.push(delay);
			await delay.pop();
		}
		if (this.spritesheet) {

			this.spritesheet.pos.x++;
			if (this.spritesheet.pos.x >= 4) this.spritesheet.pos.x = 0;
		}

		for (let i = 0; i < 4; i++) {

			this.roamState.player.pos.add(vector.quo(16));
			await createDelay();
		}

	}
	public getCurrentMapLayer() {
		return this.roamState.gameMap.layers.find(layer => layer.zIndex === (this.zIndex - 1))
	}
	public getPosAhead(direction = this.direction) {
		return this.pos.sum(Direction.toVector(direction));
	}
	public async walk(direction = this.direction) {
		const oldPos = Vector.from(this.pos);
		const posAhead = this.getPosAhead(direction);
		this.direction = direction;
		if (!this.canWalkThroughMapEdges) {

			if (
				posAhead.x < 0 || posAhead.x >= this.roamState.gameMap.size.x ||
				posAhead.y < 0 || posAhead.y >= this.roamState.gameMap.size.y
			)
				return;
		}
		const currentMapLayer = this.getCurrentMapLayer();
		if (currentMapLayer) {
			const wallActive = (data: string | boolean) => {
				if (typeof data === "boolean") return data;
				const parts = data.split("").map(s => s.toUpperCase());
				if (direction === Direction.UP && parts.includes("U")) return true;
				if (direction === Direction.DOWN && parts.includes("D")) return true;
				if (direction === Direction.LEFT && parts.includes("L")) return true;
				if (direction === Direction.RIGHT && parts.includes("R")) return true;
				return false
			}
			if (wallActive(currentMapLayer.wallAt(posAhead)) && !this.canWalkThroughWalls) {
				return;
			}
		}
		for (let i = 0; i < 4; i++) {
			await this.takeStep(direction);
		}
		this.pos.set(oldPos.sum(Direction.toVector(direction)));
		this.evtHandler.dispatchEvent('walking done')
	}
}