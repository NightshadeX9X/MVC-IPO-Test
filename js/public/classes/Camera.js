import Vector from "./Vector.js";
export var CameraMode;
(function (CameraMode) {
    CameraMode[CameraMode["FOLLOW_PLAYER"] = 0] = "FOLLOW_PLAYER";
    CameraMode[CameraMode["FIXED"] = 1] = "FIXED";
})(CameraMode || (CameraMode = {}));
export var CameraEffects;
(function (CameraEffects) {
    CameraEffects[CameraEffects["SHAKE"] = 0] = "SHAKE";
})(CameraEffects || (CameraEffects = {}));
export default class Camera {
    constructor(player) {
        this.player = player;
        this.mode = CameraMode.FOLLOW_PLAYER;
        this.pos = Vector.from(this.player.pos).multiply(this.player.roamState.tileSize);
        this.size = new Vector(480, 320);
        this._zoom = new Vector(1);
        this.fixedPos = new Vector(11, 6).multiply(this.player.roamState.tileSize);
        this.smoothing = 5;
        this.cnv = document.createElement('canvas');
        this.ctx = this.cnv.getContext('2d');
        console.log(this.pos);
        this.cnv.width = this.size.x;
        this.cnv.height = this.size.y;
    }
    get snap() {
        return this.smoothing / 15;
    }
    get zoom() {
        return this._zoom;
    }
    set zoom(val) {
        if (val.x <= 0 || val.y <= 0)
            return;
        this._zoom = val;
    }
    update() {
        this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height);
        if (this.smoothing === 0)
            this.pos = this.targetPos;
        else
            this.pos = this.pos.add(this.deltaPos?.divide(this.smoothing));
        const absDelta = this.deltaPos.map(Math.abs);
        if (absDelta.x <= this.snap && absDelta.y <= this.snap) {
            this.pos = this.targetPos;
        }
    }
    render(ctx) {
        ctx.drawImage(this.cnv, 0, 0);
    }
    drawImage(img, _pos, _size) {
        const pos = this.pos.multiply(this.zoom.multiply(-1)).add(this.size.divide(2));
        const size = _size.multiply(this.player.roamState.tileSize).multiply(this.zoom);
        this.ctx.drawImage(img, pos.x, pos.y, size.x, size.y);
    }
    get deltaPos() {
        return this.targetPos.subtract(this.pos);
    }
    get targetPos() {
        if (this.mode === CameraMode.FOLLOW_PLAYER)
            return this.player.pos.multiply(this.player.roamState.tileSize);
        else if (this.mode === CameraMode.FIXED)
            return this.fixedPos;
        else
            return new Vector();
    }
}
