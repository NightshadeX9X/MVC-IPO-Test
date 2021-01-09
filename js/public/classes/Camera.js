import Vector from "./Vector.js";
export var CameraMode;
(function (CameraMode) {
    CameraMode[CameraMode["FOLLOW_PLAYER"] = 0] = "FOLLOW_PLAYER";
    CameraMode[CameraMode["FIXED"] = 1] = "FIXED";
})(CameraMode || (CameraMode = {}));
export default class Camera {
    constructor(player, size) {
        this.player = player;
        this.size = size;
        this.mode = CameraMode.FOLLOW_PLAYER;
        this.fixedPos = new Vector(4, 1);
        this.smoothing = 50;
        this.zoom = new Vector(1);
        this.currentPos = this.targetPos;
        this.buffer = document.createElement('canvas');
        this.bufferCtx = this.buffer.getContext('2d');
        this.done = false;
        this.buffer.width = this.size.x;
        this.buffer.height = this.size.y;
    }
    preload(loader) {
        throw new Error("Method not implemented.");
    }
    get differenceToTarget() {
        return this.targetPos.subtract(this.currentPos);
    }
    update(input) {
        if (!this.differenceToTarget.equals(new Vector())) {
            this.currentPos = this.currentPos.add(this.differenceToTarget.multiply(0.8));
        }
    }
    render(renderer) {
        // E.G TO RENDER PLAYER
        // this.camera.render(this.renderer).image()
        this.bufferCtx.clearRect(0, 0, this.size.x, this.size.y);
        const self = this;
        return {
            image(img, _pos, _size) {
                /*
                camera current pos 175 175
                object pos 100 100
                camera size 300 300

                if object x were 175 (camera currentpos x) - 150 (camera size x / 2) it would appear on the top left corner. So if object x were 35, it would appear at 10x on camera.
                */
                const pos = _pos.subtract(self.currentPos.subtract(self.size.divide(2))).multiply(16);
                const size = _size.divide(self.player.roamState.currentMap?.sizeInPixels || new Vector(640, 480)).multiply(self.size.multiply(self.player.roamState.currentMap?.tileSizeInPx || 16));
                self.bufferCtx.drawImage(img, pos.x, pos.y, _size.x, _size.y);
                if (!self.done) {
                    console.log(img, pos.x, pos.y, size.x, size.y);
                    self.done = true;
                }
                renderer.ctx.drawImage(self.buffer, 0, 0);
            },
            imageComplex(img, pos1, size1, _pos2, _size2) {
                const pos2 = _pos2.subtract(self.currentPos.subtract(self.size.divide(2)));
                self.bufferCtx.drawImage(img, pos1.x, pos1.y, size1.x, size1.y, pos2.x, pos2.y, _size2.x, _size2.y);
                renderer.ctx.drawImage(self.buffer, 0, 0);
            }
        };
    }
    get targetPos() {
        if (this.mode === CameraMode.FOLLOW_PLAYER)
            return this.player.pos;
        else if (this.mode === CameraMode.FIXED)
            return this.fixedPos || new Vector();
        return new Vector();
    }
}
