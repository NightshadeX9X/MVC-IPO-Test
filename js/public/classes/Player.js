import { Direction } from "../Util.js";
import Vector from "./Vector.js";
import PlayerMovingState from './states/PlayerMovingState.js';
export default class Player {
    constructor(roamState, pos, size) {
        this.roamState = roamState;
        this.pos = pos;
        this.size = size;
        this.cameraSize = new Vector(300, 450);
        this.speed = new Vector(2);
        this.facing = Direction.UP;
    }
    async preload() { }
    update(input) {
        if (input.keyIsDown('ArrowLeft')) {
            this.facing = Direction.LEFT;
            this.roamState.stateStack.push(new PlayerMovingState(this.roamState.stateStack, this));
        }
        else if (input.keyIsDown('ArrowUp')) {
            this.facing = Direction.UP;
            this.roamState.stateStack.push(new PlayerMovingState(this.roamState.stateStack, this));
        }
        else if (input.keyIsDown('ArrowRight')) {
            this.facing = Direction.RIGHT;
            this.roamState.stateStack.push(new PlayerMovingState(this.roamState.stateStack, this));
        }
        else if (input.keyIsDown('ArrowDown')) {
            this.facing = Direction.DOWN;
            this.roamState.stateStack.push(new PlayerMovingState(this.roamState.stateStack, this));
        }
    }
    render(renderer) {
        let multiplier = this.roamState.currentMap?.tileSizeInPx || 16;
        renderer.rect(this.pos.multiply(multiplier), this.size.multiply(multiplier));
    }
}
