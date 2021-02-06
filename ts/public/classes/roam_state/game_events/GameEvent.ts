import { Direction, directionToVector } from "../../../Util.js";
import Camera from "../Camera.js";
import Spritesheet from "../../Spritesheet.js";
import RoamState from "../../states/RoamState.js";
import Vector from "../../Vector.js";

export default class GameEvent {
	disabled = false;
	static interactEvt = new Event('interact');
	static *IDGenerator() {
		let id = 0;
		while (true) {
			yield `EVENT${id++}`;
		}
	}
	isAheadOfPlayer() {
		if (!this.roamState) return false;
		return !!this.getCoveredTiles().find(v => v.equals(this.roamState?.player.tileAhead || new Vector))
	}
	static IDs = GameEvent.IDGenerator();
	static getNewID() {
		return this.IDs.next().value as string;
	}
	zIndex = 1;
	ID = GameEvent.getNewID();
	evtManager = new EventTarget();
	public data: {
		spritesheet: Spritesheet | null
		passable: boolean;
		pos: Vector,
		size: Vector,
		renderOffset: Vector,
		renderSize: Vector,
		isRendered: boolean,
		trigger: GameEventTrigger,
		isParallelProcess: boolean,
	} = GameEvent.defaultData;
	getCoveredTiles() {
		return this.data.pos.rangeTo(this.data.pos.sum(this.data.size));
	}
	public variables = new Map<string, any>();
	constructor(public type: GameEventType, public roamState?: RoamState, data: Partial<GameEvent["data"]> = {}) {
		this.setData(data);
		this.evtManager.addEventListener('interact', () => {
			if (this.type === GameEventType.NPC && this.data.spritesheet && this.roamState) {
				switch (this.roamState.player.direction) {
					case Direction.UP:
						this.data.spritesheet.coords.y = 0;
						break;
					case Direction.RIGHT:
						this.data.spritesheet.coords.y = 1;
						break;
					case Direction.LEFT:
						this.data.spritesheet.coords.y = 2;
						break;
					case Direction.DOWN:
						this.data.spritesheet.coords.y = 3;
						break;
				}
			}
		})
	};
	setData(data: Partial<GameEvent["data"]> = {}) {
		this.data = {
			...GameEvent.defaultData,
			...data,
		};
	}
	once = false;
	render(camera: Camera) {
		if (!this.once) {

			console.log(this.data, this.roamState);
			this.once = true;
		}
		if (!this.data.spritesheet?.image || !this.roamState || !this.data.isRendered) return;
		const coords = camera.convertCoords(this.data.pos.sum(this.data.renderOffset).prod(this.roamState.tileSize));
		this.data.spritesheet.render(camera.ctx, coords);
	}
	private static get defaultData() {
		return {
			spritesheet: null,
			passable: false,
			pos: new Vector,
			size: new Vector(1),
			renderOffset: new Vector,
			renderSize: new Vector(1),
			isRendered: true,
			trigger: GameEventTrigger.INTERACTION_KEY,
			isParallelProcess: false
		} as GameEvent["data"];
	}
}

export enum GameEventTrigger {
	PLAYER_TOUCH,
	INTERACTION_KEY,
	MAP_ENTER,
	EVENT_TOUCH
}

export interface GameEventData {
	type: GameEventType,
	imageURL?: string,
	data?: Partial<GameEvent["data"]>;
	onInteract(): Promise<void>;
}
export enum GameEventType {
	NPC,
	REGULAR,
	BATTLER
}