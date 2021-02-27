import { Renderable, Updatable } from "../core/Attributes.js";
import { createCanvas, New } from "../util/functions.js";
import Vector from "../util/Vector.js";
class Camera {
    constructor(...args) {
        return New(Camera, ...args);
    }
    static construct(roamState, size) {
        Updatable.construct.call(this);
        Renderable.construct.call(this);
        this.roamState = roamState;
        this.mode = Camera.Mode.FOLLOW_PLAYER;
        this.fixedPos = new Vector;
        this.pos = new Vector(this.targetPos.x, this.targetPos.y);
        this.size = size;
        const canvas = createCanvas(this.size);
        this.cnv = canvas.cnv;
        this.ctx = canvas.ctx;
        return this;
    }
    update() {
        if (this.pos.distFrom(this.targetPos) > 1)
            this.moveCloserToTarget();
        else
            this.pos.set(this.targetPos);
    }
    convertCoords(pos) {
        return pos.diff(this.pos).sum(this.size.quo(2));
    }
    render(ctx) {
        ctx.drawImage(this.cnv, 0, 0);
        this.ctx.clearRect(0, 0, this.size.x, this.size.y);
    }
    moveCloserToTarget() {
        this.pos.add(this.targetPos.diff(this.pos).quo(16));
    }
    get targetPos() {
        let target = new Vector();
        if (this.mode === Camera.Mode.FOLLOW_PLAYER)
            target.set(this.roamState.player.pos.sum(0.5, 0).prod(this.roamState.tileSize));
        else
            target.set(this.fixedPos);
        return target;
    }
}
(function (Camera) {
    let Mode;
    (function (Mode) {
        Mode[Mode["FOLLOW_PLAYER"] = 0] = "FOLLOW_PLAYER";
        Mode[Mode["FIXED"] = 1] = "FIXED";
    })(Mode = Camera.Mode || (Camera.Mode = {}));
})(Camera || (Camera = {}));
export default Camera;
