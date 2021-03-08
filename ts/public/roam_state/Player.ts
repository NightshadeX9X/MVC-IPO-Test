import { Updatable } from "../core/Attributes.js";
import Input from "../core/Input.js";
import RoamState from "../states/RoamState.js";
import { ArgsType } from "../util/types.js";
import Vector from "../util/Vector.js";
import Walker from "./Walker.js";
import Direction from "../util/Direction.js";
import Events from "../util/Events.js";
import { Parents } from "../util/functions.js";

interface Player extends Walker, Updatable { }
@Parents(Walker, Updatable)
class Player {
	lastInteraction = 0;
	evtHandler = new Events.Handler();
	canInteract = true;
	constructor(public roamState: RoamState) {
		Walker.call(this, roamState, new Vector(), 'player');
		Updatable.call(this);
		this.evtHandler.addEventListener('walk', (oldPos: Vector, newPos: Vector, direction: Direction) => {
			const gameObjects = this.roamState.gameObjects.filter(go => go.getCoveredSquares().find(v => v.equals(newPos)));
			gameObjects.forEach(gameObject => {
				gameObject.evtHandler.dispatchEvent('playertouch');
			})
		});
		this.pos = new Vector(4, 20);
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

		if (this.lastInteraction > 20 && !this.walking && input.interactionKey && this.canInteract) {
			this.lastInteraction = 0;
			const ahead = this.getPosAhead();
			const gameObject = this.roamState.gameObjects.find(go => go.pos.equals(ahead));
			if (gameObject) {
				gameObject.evtHandler.dispatchEvent('interact', gameObject);
			}
		}
		this.lastInteraction++;
	}
}




export default Player;