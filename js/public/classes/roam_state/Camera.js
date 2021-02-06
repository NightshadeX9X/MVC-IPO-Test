import Vector from "../Vector.js";
export default class Camera {
    constructor(player, size) {
        this.player = player;
        this.size = size;
        this.zoom = 1;
        this.mode = CameraMode.FOLLOW_PLAYER;
        this.pos = new Vector;
        this.smoothing = 0;
        this.cnv = document.createElement('canvas');
        this.ctx = this.cnv.getContext('2d');
        this.fixedPos = this.player.pos;
        this.size.div(this.zoom);
        this.cnv.width = size.x;
        this.cnv.height = size.y;
    }
    incrementPos() {
        if (this.smoothing === 0) {
            this.pos = this.targetPos;
            return;
        }
        const smoothing = this.smoothing + 14;
        const diff = this.targetPos.diff(this.pos);
        const cutoff = (smoothing * 0.1 + 13) / smoothing;
        if (!diff.mapReturn(Math.abs).lessThan(cutoff)) {
            this.pos.add(diff.quo(smoothing));
        }
        else {
            this.pos = this.targetPos;
        }
    }
    init() {
        this.pos = this.targetPos;
    }
    update() {
        this.incrementPos();
        this.cnv.width = this.size.x / this.zoom;
        this.cnv.height = this.size.y / this.zoom;
    }
    convertCoords(pos) {
        return pos.diff(this.pos).sum(this.cnv.width / 2, this.cnv.height / 2);
    }
    get targetPos() {
        if (this.mode === CameraMode.FOLLOW_PLAYER)
            return this.player.pos.sum(0, 0).prod(this.player.roamState.tileSize);
        else
            return this.fixedPos;
    }
    clear() {
        this.ctx.clearRect(0, 0, this.size.x, this.size.y);
    }
    render(ctx) {
        ctx.save();
        ctx.scale(this.zoom, this.zoom);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(this.cnv, 0, 0);
        ctx.restore();
    }
}
export var CameraMode;
(function (CameraMode) {
    CameraMode[CameraMode["FOLLOW_PLAYER"] = 0] = "FOLLOW_PLAYER";
})(CameraMode || (CameraMode = {}));
