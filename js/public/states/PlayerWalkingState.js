import State from "../core/State.js";
import { directionToVector } from "../util/Direction.js";
import Vector from "../util/Vector.js";
import DelayState from "./DelayState.js";
export default class PlayerWalkingState extends State {
    constructor(stateStack, roamState, direction) {
        super(stateStack);
        this.stateStack = stateStack;
        this.roamState = roamState;
        this.direction = direction;
        this.playerStartingPos = Vector.from(this.roamState.player.pos);
    }
    async preload() {
        this.handleMovement();
        this.evtHandler.addEventListener('movement done', () => {
            this.stateStack.pop();
        });
    }
    update(input) {
        this.roamState.update(input);
    }
    get playerTarget() {
        return this.playerStartingPos.sum(this.vector);
    }
    async handleMovement() {
        for (let i = 0; i < 4; i++) {
            await this.takeStep();
        }
        this.roamState.player.pos = this.playerTarget;
        this.evtHandler.dispatchEvent('movement done');
    }
    get vector() {
        return directionToVector(this.direction);
    }
    async takeStep() {
        for (let i = 0; i < 4; i++) {
            this.roamState.player.pos.add(this.vector.quo(16));
            const delay = new DelayState(this.stateStack, 1);
            const oldUpdate = delay.update.bind(delay);
            delay.update = (input) => {
                oldUpdate(input);
                this.update(input);
            };
            this.stateStack.push(delay);
            await delay.pop();
        }
        console.log("step");
    }
}
