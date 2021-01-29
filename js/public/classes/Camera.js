import Vector from "./Vector.js";
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
        const smoothing = this.smoothing + 14;
        if (smoothing === 0) {
            this.pos = this.targetPos;
            return;
        }
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
    }
    convertCoords(pos) {
        return pos.diff(this.pos).sum(this.size.quo(2));
    }
    get targetPos() {
        if (this.mode === CameraMode.FOLLOW_PLAYER)
            return this.player.pos.sum(0.5, 0.5).prod(this.player.roamState.tileSize);
        else
            return this.fixedPos;
    }
    clear() {
        this.ctx.clearRect(0, 0, this.size.x, this.size.y);
    }
    render(ctx) {
        const cnv = document.createElement('canvas');
        const _ctx = cnv.getContext('2d');
        cnv.width = this.cnv.width * this.zoom;
        cnv.height = this.cnv.height * this.zoom;
        ctx.scale(this.zoom, this.zoom);
        ctx.imageSmoothingEnabled = false;
        _ctx.drawImage(this.cnv, 0, 0);
        ctx.drawImage(cnv, 0, 0);
        ctx.scale(1 / this.zoom, 1 / this.zoom);
    }
}
export var CameraMode;
(function (CameraMode) {
    CameraMode[CameraMode["FOLLOW_PLAYER"] = 0] = "FOLLOW_PLAYER";
})(CameraMode || (CameraMode = {}));
