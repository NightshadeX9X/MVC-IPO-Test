import Camera from "./Camera.js";
import Vector from "./Vector.js";
export default class Player {
    constructor(roamState) {
        this.roamState = roamState;
        this.pos = new Vector(18, 1);
        this.size = new Vector(1, 1);
        this.drawSize = new Vector(1, 2);
        this.camera = new Camera(this);
        this.moving = false;
    }
    async preload() {
        throw new Error("Method not implemented.");
    }
    init() {
        throw new Error("Method not implemented.");
    }
    update(controller) {
        this.camera.update();
    }
    render(ctx) {
        throw new Error("Method not implemented.");
    }
}
