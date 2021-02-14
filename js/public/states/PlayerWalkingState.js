import State from "../core/State.js";
import { directionToVector } from "../util/Direction.js";
import Vector from "../util/Vector.js";
export default class PlayerWalkingState extends State {
    constructor(stateStack, roamState, direction) {
        super(stateStack);
        this.stateStack = stateStack;
        this.roamState = roamState;
        this.direction = direction;
        this.playerStartingPos = Vector.from(this.roamState.player.pos);
    }
    async preload() {
        this.roamState.toUpdate = true;
        this.handleMovement();
        this.evtHandler.addEventListener('popped', () => {
            this.roamState.toUpdate = null;
        });
        this.evtHandler.addEventListener('movement done', () => {
            console.log(this.roamState.camera.convertCoords(this.roamState.player.pos), this.roamState.camera.pos);
            this.stateStack.pop();
        });
    }
    update(input) {
    }
    get playerTarget() {
        return this.playerStartingPos.sum(this.vector);
    }
    async handleMovement() {
        await this.roamState.player.walk(this.direction);
        this.evtHandler.dispatchEvent('movement done');
    }
    get vector() {
        return directionToVector(this.direction);
    }
}
