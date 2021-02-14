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
        this.roamState.toUpdate = true;
        this.handleMovement();
        this.evtHandler.addEventListener('popped', () => {
            this.roamState.toUpdate = null;
        });
        this.evtHandler.addEventListener('movement done', () => {
            this.stateStack.pop();
        });
    }
    update(input) {
    }
    get playerTarget() {
        return this.playerStartingPos.sum(this.vector);
    }
    async handleMovement() {
        for (let i = 0; i < 4; i++) {
            await this.takeStep();
        }
        // this.roamState.player.pos.set(this.playerTarget);
        this.evtHandler.dispatchEvent('movement done');
    }
    get vector() {
        return directionToVector(this.direction);
    }
    async takeStep() {
        const createDelay = async () => {
            const delay = new DelayState(this.stateStack, 1);
            this.stateStack.push(delay);
            await delay.pop();
        };
        if (!this.roamState.player.spritesheet)
            return;
        this.roamState.player.spritesheet.pos.x++;
        if (this.roamState.player.spritesheet.pos.x >= 4)
            this.roamState.player.spritesheet.pos.x = 0;
        for (let i = 0; i < 4; i++) {
            this.roamState.player.pos.add(this.vector.quo(16));
            await createDelay();
        }
    }
}
