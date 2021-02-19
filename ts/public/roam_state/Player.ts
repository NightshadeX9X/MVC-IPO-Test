import { Entity } from "../core/Attributes.js";
import Input from "../core/Input.js";
import Loader from "../core/Loader.js";
import PlayerWalkingState from "../states/PlayerWalkingState.js";
import RoamState from "../states/RoamState.js";
import Direction from "../util/Direction.js";
import Events from "../util/Events.js";
import { applyMixins } from "../util/functions.js";
import Spritesheet from "../util/Spritesheet.js";
import Vector from "../util/Vector.js";
import GameObject from "./GameObject.js";
import MWalker from "./MWalker.js";

class Player implements Entity {
	public image: HTMLImageElement | null = null;
	public spritesheet: Spritesheet | null = null;
	public pos = new Vector(1);
	public size = new Vector(1);
	public direction = Direction.DOWN;
	public zIndex = 1;
	public evtHandler = new Events.Handler();
	private interactionCooldown = 0;
	public walkingEnabled = true;
	constructor(public roamState: RoamState) {
		MWalker.construct.call(this, "player");
		this.pos = new Vector(7, 24);
		this.direction = Direction.DOWN;
		this.zIndex = 1;
		this.evtHandler = new Events.Handler();
		this.roamState = roamState;
	}
	public async preload(loader: Loader) {
		MWalker.prototype.preload.call(this, loader);
		console.log(this.image)

		this.roamState.stateStack.game.input.evtHandler.addEventListener('keypress', (key: string) => {
			if (!this.roamState.stateStack.game.cheatMode) return;
			if (key === "u") {
				this.zIndex++;
				console.log(this.zIndex)
			}
			if (key === "y") {
				this.zIndex--;
				console.log(this.zIndex)
			}
		})
	}
	public get coveredSquares() {
		return [this.pos]
	}
	public update(input: Input): void {
		if (input.interactionKey && this.interactionCooldown <= 0) {
			(() => {
				const go = this.roamState.gameObjects.toArray().filter(go => go.zIndex === this.zIndex).find((go) => go.coveredSquares.find(v => v.equals(this.getPosAhead())))
				if (!go) return;
				go.evtHandler.dispatchEvent('activation', GameObject.ActivationMethod.INTERACTION);
				this.interactionCooldown = 21;
			})()
		}

		for (let key in input.directionKeyStates) {
			const d = key as Direction.AsString;
			if (!input.directionKeyStates[d] || !this.walkingEnabled) continue;
			this.setDirection(Direction[d]);
			this.roamState.stateStack.push(new PlayerWalkingState(this.roamState.stateStack, this.roamState, Direction[d]))
		}
		this.interactionCooldown--;
	}
}

interface Player extends MWalker { }


applyMixins(Player, [MWalker])

export default Player;