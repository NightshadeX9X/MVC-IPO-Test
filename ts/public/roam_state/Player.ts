import { Updatable } from "../core/Attributes.js";
import Input from "../core/Input.js";
import RoamState from "../states/RoamState.js";
import { Mixin, New } from "../util/functions.js";
import { ArgsType } from "../util/types.js";
import Vector from "../util/Vector.js";
import Walker from "./Walker.js";
import Direction from "../util/Direction.js";
import Events from "../util/Events.js";

interface Player extends Walker, Updatable {
	evtHandler: Events.Handler;
	lastInteraction: number;
}
class Player {
	constructor(...args: ArgsType<typeof Player["construct"]>) {
		return New(Player, ...args);
	}
	static construct(this: Player, roamState: RoamState) {
		Walker.construct.call(this, roamState, new Vector(), 'player');
		Updatable.construct.call(this);

		this.evtHandler = new Events.Handler();
		this.lastInteraction = 0;
		this.evtHandler.addEventListener('walk', (oldPos: Vector, newPos: Vector, direction: Direction) => {
			const gameObjects = this.roamState.gameObjects.filter(go => go.getCoveredSquares().find(v => v.equals(newPos)));
			gameObjects.forEach(gameObject => {
				gameObject.evtHandler.dispatchEvent('playertouch');
			})
		})

		return this;
	}
	update(input: Input) {
		for (const key in input.directionKeyStates) {
			const dirStr = key as Direction.AsString;
			if (input.directionKeyStates[dirStr]) {
				this.walk(Direction[dirStr]);
				break;
			}
		}

		if (this.walking) {
			for (const key in input.directionKeyStates) {
				const dirStr = key as Direction.AsString;
				if (input.directionKeyStates[dirStr]) {
					break;
				}
			}
		}

		if (this.lastInteraction > 20 && !this.walking && input.interactionKey) {
			this.lastInteraction = 0;
			const ahead = this.getPosAhead();
			const gameObject = this.roamState.gameObjects.find(go => go.pos.equals(ahead));
			if (gameObject) {
				gameObject.evtHandler.dispatchEvent('interact');
			}
		}
		this.lastInteraction++;
	}
}

Mixin.apply(Player, [Walker, Updatable])



export default Player;