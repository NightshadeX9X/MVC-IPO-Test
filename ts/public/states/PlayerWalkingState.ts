import Input from "../core/Input.js";
import State from "../core/State.js";
import StateStack from "../core/StateStack.js";
import Direction from "../util/Direction.js";
import Vector from "../util/Vector.js";
import DelayState from "./DelayState.js";
import RoamState from "./RoamState.js";

export default class PlayerWalkingState extends State {
	private playerStartingPos = Vector.from(this.roamState.player.pos);
	constructor(public stateStack: StateStack, public roamState: RoamState, public direction: Direction) {
		super(stateStack);
		this.link(this.roamState);
		this.roamState.player.walkingEnabled = false;
	}

	public async preload() {
		// this.roamState.toUpdate = true;

		this.handleMovement();
		this.evtHandler.addEventListener('popped', () => {
			this.roamState.player.walkingEnabled = true;
		})
	}

	public update(input: Input) {
	}

	private get playerTarget() {
		return this.playerStartingPos.sum(this.vector);
	}
	private async handleMovement() {
		await this.roamState.player.walk(this.direction, this.roamState.stateStack);
		this.stateStack.pop();
	}

	private get vector() {
		return Direction.toVector(this.direction);
	}

}