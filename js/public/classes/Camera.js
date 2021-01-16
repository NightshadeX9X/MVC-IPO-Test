import Vector from "./Vector.js";
export default class Camera {
    constructor(player, size) {
        this.player = player;
        this.size = size;
        this.mode = CameraMode.FOLLOW_PLAYER;
        this.pos = new Vector;
        this.cnv = document.createElement('canvas');
        this.ctx = this.cnv.getContext('2d');
        this.cnv.width = size.x;
        this.cnv.height = size.y;
    }
    update() {
        this.pos = this.targetPos;
    }
    convertCoords(pos) {
        return pos.diff(this.pos).sum(this.size.quo(2));
    }
    get targetPos() {
        return this.player.pos.prod(this.player.roamState.tileSize);
    }
    clear() {
        this.ctx.clearRect(0, 0, this.size.x, this.size.y);
    }
    render(ctx) {
        ctx.drawImage(this.cnv, 0, 0);
    }
}
export var CameraMode;
(function (CameraMode) {
    CameraMode[CameraMode["FOLLOW_PLAYER"] = 0] = "FOLLOW_PLAYER";
})(CameraMode || (CameraMode = {}));
