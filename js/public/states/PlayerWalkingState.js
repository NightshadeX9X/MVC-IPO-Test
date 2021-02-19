import State from "../core/State.js";
import Direction from "../util/Direction.js";
import Vector from "../util/Vector.js";
export default class PlayerWalkingState extends State {
    constructor(stateStack, roamState, direction) {
        super(stateStack);
        this.stateStack = stateStack;
        this.roamState = roamState;
        this.direction = direction;
        this.playerStartingPos = Vector.from(this.roamState.player.pos);
        this.link(this.roamState);
        this.roamState.player.walkingEnabled = false;
    }
    async preload() {
        // this.roamState.toUpdate = true;
        this.handleMovement();
        this.evtHandler.addEventListener('popped', () => {
            this.roamState.player.walkingEnabled = true;
        });
    }
    update(input) {
    }
    get playerTarget() {
        return this.playerStartingPos.sum(this.vector);
    }
    async handleMovement() {
        await this.roamState.player.walk(this.direction, this.roamState.stateStack);
        this.stateStack.pop();
    }
    get vector() {
        return Direction.toVector(this.direction);
    }
}
