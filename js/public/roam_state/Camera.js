var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Renderable, Updatable } from "../core/Attributes.js";
import { createCanvas, Parents, } from "../util/functions.js";
import Vector from "../util/Vector.js";
var Camera = /** @class */ (function () {
    function Camera(roamState, size) {
        this.roamState = roamState;
        this.size = size;
        this.mode = Camera_1.Mode.FOLLOW_PLAYER;
        this.fixedPos = new Vector;
        this.pos = new Vector(this.targetPos.x, this.targetPos.y);
        Updatable.call(this);
        Renderable.call(this);
        var canvas = createCanvas(this.size);
        this.cnv = canvas.cnv;
        this.ctx = canvas.ctx;
    }
    Camera_1 = Camera;
    Camera.construct = function () {
        return this;
    };
    Camera.prototype.update = function () {
        if (this.pos.distFrom(this.targetPos) > 1)
            this.moveCloserToTarget();
        else
            this.pos.set(this.targetPos);
    };
    Camera.prototype.convertCoords = function (pos) {
        return pos.diff(this.pos).sum(this.size.quo(2));
    };
    Camera.prototype.render = function (ctx) {
        ctx.drawImage(this.cnv, 0, 0);
        this.ctx.clearRect(0, 0, this.size.x, this.size.y);
    };
    Camera.prototype.moveCloserToTarget = function () {
        this.pos.add(this.targetPos.diff(this.pos).quo(16));
    };
    Object.defineProperty(Camera.prototype, "targetPos", {
        get: function () {
            var target = new Vector();
            if (this.mode === Camera_1.Mode.FOLLOW_PLAYER)
                target.set(this.roamState.player.pos.sum(0.5, 0).prod(this.roamState.tileSize));
            else
                target.set(this.fixedPos);
            return target;
        },
        enumerable: false,
        configurable: true
    });
    var Camera_1;
    Camera = Camera_1 = __decorate([
        Parents(Updatable, Renderable)
    ], Camera);
    return Camera;
}());
(function (Camera) {
    var Mode;
    (function (Mode) {
        Mode[Mode["FOLLOW_PLAYER"] = 0] = "FOLLOW_PLAYER";
        Mode[Mode["FIXED"] = 1] = "FIXED";
    })(Mode = Camera.Mode || (Camera.Mode = {}));
})(Camera || (Camera = {}));
export default Camera;
