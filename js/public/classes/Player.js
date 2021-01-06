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
        this.spriteSheetCords = new Vector(0, 0);
        this.spriteSheetSrc = '../../assets/images/people/player.png';
        this.spriteSheet = null;
        this.speed = new Vector(Math.floor(this.speed.x), Math.floor(this.speed.y));
    }
    async preload(loader) {
        const image = await loader.image(this.spriteSheetSrc);
        this.spriteSheet = image;
    }
    update(input) {
        if (input.keyIsDown('ArrowLeft')) {
            this.facing = Direction.LEFT;
            this.spriteSheetCords.y = 2;
            this.roamState.stateStack.push(new PlayerMovingState(this.roamState.stateStack, this));
        }
        else if (input.keyIsDown('ArrowUp')) {
            this.facing = Direction.UP;
            this.spriteSheetCords.y = 6;
            this.roamState.stateStack.push(new PlayerMovingState(this.roamState.stateStack, this));
        }
        else if (input.keyIsDown('ArrowRight')) {
            this.facing = Direction.RIGHT;
            this.spriteSheetCords.y = 4;
            this.roamState.stateStack.push(new PlayerMovingState(this.roamState.stateStack, this));
        }
        else if (input.keyIsDown('ArrowDown')) {
            this.facing = Direction.DOWN;
            this.spriteSheetCords.y = 0;
            this.roamState.stateStack.push(new PlayerMovingState(this.roamState.stateStack, this));
        }
    }
    render(renderer) {
        let multiplier = this.roamState.currentMap?.tileSizeInPx || 16;
        // const pos = new Vector(this.pos.x, this.pos.y).subtract(new Vector(0, 1)).multiply(multiplier);
        const pos = new Vector(15, 10).subtract(new Vector(0, 1)).multiply(multiplier);
        const size = this.size.multiply(multiplier);
        const spriteSheetCords = this.spriteSheetCords.multiply(multiplier);
        // renderer.ctx.fillRect(pos.x, pos.y, size.x, size.y)
        // renderer.rect(new Vector(15.5, 10).multiply(16), this.size.multiply(16))
        if (this.spriteSheet) {
            console.log(this.facing);
            renderer.ctx.drawImage(this.spriteSheet, spriteSheetCords.x, spriteSheetCords.y, size.x, size.y, pos.x, pos.y, size.x, size.y);
        }
    }
}
