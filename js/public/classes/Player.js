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
        this.camera.smoothing = 0;
    }
    async preload() {
        throw new Error("Method not implemented.");
    }
    init() {
        throw new Error("Method not implemented.");
    }
    update(controller) {
        let vec = new Vector();
        if (controller.keyIsDown("ArrowUp"))
            vec.y = -1;
        if (controller.keyIsDown("ArrowDown"))
            vec.y = 1;
        if (controller.keyIsDown("ArrowLeft"))
            vec.x = -1;
        if (controller.keyIsDown("ArrowRight"))
            vec.x = 1;
        this.pos = this.pos.add(vec.multiply(1));
        if (!vec.equals(new Vector()))
            console.log(this.pos);
        this.camera.update();
    }
    render(ctx) {
        this.camera.rect(this.pos.subtract(new Vector(0, 1)).multiply(16), this.drawSize);
    }
}
