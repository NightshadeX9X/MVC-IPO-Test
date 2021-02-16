import { createCanvas } from "../util/functions.js";
import Vector from "../util/Vector.js";
class Camera {
    constructor(roamState) {
        this.roamState = roamState;
        this.mode = 0 /* FOLLOW_PLAYER */;
        this.fixedPos = new Vector;
        this.pos = Vector.from(this.fixedPos);
        this.smoothing = 30;
        this.zoom = 1;
        this.startingSize = new Vector(240, 160);
        const cnvData = createCanvas(this.startingSize);
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
        this.cnv.width = this.startingSize.quo(this.zoom).x;
        this.cnv.height = this.startingSize.quo(this.zoom).y;
    }
    render(ctx) {
        ctx.save();
        ctx.scale(this.zoom, this.zoom);
        ctx.drawImage(this.cnv, 0, 0);
        ctx.restore();
        this.ctx.clearRect(0, 0, this.size.x, this.size.y);
    }
    fixTo(pos) {
        this.mode = 1 /* FIXED */;
        this.fixedPos = pos;
    }
    get target() {
        if (this.mode === 0 /* FOLLOW_PLAYER */) {
            return this.roamState.player.pos.sum(0.5, 0).prod(this.roamState.tileSize);
        }
        return this.fixedPos;
    }
}
export default Camera;
