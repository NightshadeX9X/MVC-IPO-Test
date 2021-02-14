import Input from "../core/Input.js";
import State from "../core/State.js";
import StateStack from "../core/StateStack.js";
import Direction, { directionToVector } from "../util/Direction.js";
import Vector from "../util/Vector.js";
import DelayState from "./DelayState.js";
import RoamState from "./RoamState.js";

export default class PlayerWalkingState extends State {
	private playerStartingPos = Vector.from(this.roamState.player.pos);
	constructor(public stateStack: StateStack, public roamState: RoamState, public direction: Direction) {
		super(stateStack);
	}

	async preload() {
		this.handleMovement();
		this.evtHandler.addEventListener('movement done', () => {
			this.stateStack.pop();
		})
	}

	update(input: Input) {
		this.roamState.update(input)
	}

	private get playerTarget() {
		return this.playerStartingPos.sum(this.vector);
	}
	private async handleMovement() {
		for (let i = 0; i < 4; i++) {
			await this.takeStep();
		}
		this.roamState.player.pos = this.playerTarget;
		this.evtHandler.dispatchEvent('movement done')
	}

	private get vector() {
		return directionToVector(this.direction);
	}

	private async takeStep() {
		if (!this.roamState.player.spritesheet) return;
		for (let i = 0; i < 4; i++) {
			this.roamState.player.pos.add(this.vector.quo(16));
			if (i % 2 === 0)
				this.roamState.player.spritesheet.pos.x++;
			if (this.roamState.player.spritesheet.pos.x >= 4) this.roamState.player.spritesheet.pos.x = 0;
			const delay = new DelayState(this.stateStack, 1);
			const oldUpdate = delay.update.bind(delay);
			delay.update = (input: Input) => {
				oldUpdate(input);
				this.update(input);
			}
			this.stateStack.push(delay);
			await delay.pop();
		}
		console.log("step")
	}

}