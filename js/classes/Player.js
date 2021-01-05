import Vector from "./Vector.js";
export default class Player {
    constructor(roamState, pos, size) {
        this.roamState = roamState;
        this.pos = pos;
        this.size = size;
        this.cameraSize = new Vector(300, 450);
    }
    async preload() { }
    update() {
        this.pos = this.pos.add(1);
    }
    render(renderer) {
        renderer.rect(this.pos, this.size);
    }
}
