import { Direction } from "../Util.js";
import Vector from "./Vector.js";
import PlayerMovingState from './states/PlayerMovingState.js';
export default class Player {
    constructor(roamState, pos, size) {
        this.roamState = roamState;
        this.pos = pos;
        this.size = size;
        this.cameraSize = new Vector(480, 320);
        this.speed = new Vector(1);
        this.facing = Direction.UP;
        this.speed = new Vector(Math.floor(this.speed.x), Math.floor(this.speed.y));
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
        const pos = new Vector(this.pos.x, this.pos.y).subtract(new Vector(0, 1)).multiply(multiplier);
        const size = new Vector(this.size.x, this.size.y).multiply(multiplier);
        // renderer.ctx.fillRect(pos.x, pos.y, size.x, size.y)
        renderer.rect(new Vector(15.5, 10).multiply(16), this.size.multiply(16));
    }
}
