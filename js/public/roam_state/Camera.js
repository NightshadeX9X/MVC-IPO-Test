import { createCanvas } from "../util/functions.js";
import Vector from "../util/Vector.js";
class Camera {
    constructor(roamState) {
        this.roamState = roamState;
        this.mode = 0 /* FOLLOW_PLAYER */;
        this.fixedPos = new Vector;
        this.pos = Vector.from(this.fixedPos);
        this.smoothing = 30;
        const cnvData = createCanvas(new Vector(400, 200));
        this.cnv = cnvData.cnv;
        this.ctx = cnvData.ctx;
        this.ctx.imageSmoothingEnabled = false;
    }
    get size() {
        return new Vector(this.cnv.width, this.cnv.height);
    }
    convertCoords(coords) {
        const halfSize = this.size.quo(2);
        return halfSize.diff(this.pos).sum(coords);
    }
    advanceTowardsTarget() {
        /* this.pos.add(this.distanceFromTarget.prod(1 / this.smoothing));
        if (this.distanceFromTarget.map(Math.abs).lessThanOrEqualTo(1)) {
            this.pos.set(this.target);
        } */
        this.pos.set(this.target);
    }
    get distanceFromTarget() {
        return this.target.diff(this.pos);
    }
    update() {
        this.advanceTowardsTarget();
    }
    render(ctx) {
        ctx.drawImage(this.cnv, 0, 0);
        this.ctx.clearRect(0, 0, this.size.x, this.size.y);
    }
    fixTo(pos) {
        this.mode = 1 /* FIXED */;
        this.fixedPos = pos;
    }
    get target() {
        if (this.mode === 0 /* FOLLOW_PLAYER */) {
            return this.roamState.player.pos.prod(this.roamState.tileSize).sum(8, 0);
        }
        return this.fixedPos;
    }
}
export default Camera;
