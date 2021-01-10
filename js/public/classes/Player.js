import { Direction } from "../Util.js";
import Camera from "./Camera.js";
import PlayerMovingState from "./states/PlayerMovingState.js";
import Vector from "./Vector.js";
export default class Player {
    constructor(roamState) {
        this.roamState = roamState;
        this.pos = new Vector(18, 1);
        this.size = new Vector(1, 1);
        this.drawSize = new Vector(1, 2);
        this.camera = new Camera(this);
        this.moving = false;
        this.facing = Direction.DOWN;
        this.camera.smoothing = 0;
    }
    async preload() {
        throw new Error("Method not implemented.");
    }
    init() {
        throw new Error("Method not implemented.");
    }
    update(controller) {
        let direction = null;
        if (controller.keyIsDown("ArrowUp"))
            direction = Direction.UP;
        if (controller.keyIsDown("ArrowDown"))
            direction = Direction.DOWN;
        if (controller.keyIsDown("ArrowLeft"))
            direction = Direction.LEFT;
        if (controller.keyIsDown("ArrowRight"))
            direction = Direction.RIGHT;
        if (direction !== null) {
            const playerMovingState = new PlayerMovingState(this.roamState.stateStack, direction, this);
            this.roamState.stateStack.push(playerMovingState);
        }
        this.camera.update();
    }
    render(ctx) {
        this.camera.rect(this.pos.subtract(new Vector(0, 1)).multiply(16), this.drawSize);
    }
}
