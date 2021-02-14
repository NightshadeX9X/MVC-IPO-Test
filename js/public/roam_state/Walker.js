import DelayState from "../states/DelayState.js";
import { directionToVector } from "../util/Direction.js";
import Vector from "../util/Vector.js";
export default class MWalker {
    constructor() {
        this.pos = null;
        this.spritesheet = null;
        this.roamState = null;
        this.evtHandler = null;
    }
    static construct() { }
    async takeStep(direction) {
        const vector = directionToVector(direction);
        const createDelay = async () => {
            const delay = new DelayState(this.roamState.stateStack, 1);
            this.roamState.stateStack.push(delay);
            await delay.pop();
        };
        if (this.spritesheet) {
            this.spritesheet.pos.x++;
            if (this.spritesheet.pos.x >= 4)
                this.spritesheet.pos.x = 0;
        }
        for (let i = 0; i < 4; i++) {
            this.roamState.player.pos.add(vector.quo(16));
            await createDelay();
        }
    }
    async walk(direction) {
        const oldPos = Vector.from(this.pos);
        for (let i = 0; i < 4; i++) {
            await this.takeStep(direction);
        }
        // this.pos.set(oldPos.sum(directionToVector(direction)));
        this.evtHandler.dispatchEvent('walking done');
    }
}
