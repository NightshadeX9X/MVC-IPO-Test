var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Renderable } from "../core/Attributes.js";
import { Parents } from "./functions.js";
import Vector from "./Vector.js";
var Spritesheet = /** @class */ (function () {
    function Spritesheet(image, singleImageSize, imageCount, coords) {
        if (singleImageSize === void 0) { singleImageSize = new Vector(16, 32); }
        if (imageCount === void 0) { imageCount = new Vector(4); }
        if (coords === void 0) { coords = new Vector; }
        this.image = image;
        this.singleImageSize = singleImageSize;
        this.imageCount = imageCount;
        this.coords = coords;
        Renderable.call(this);
    }
    Spritesheet.prototype.render = function (ctx) {
        var coords = this.coords.prod(this.singleImageSize);
        ctx.drawImage(this.image, coords.x, coords.y, this.singleImageSize.x, this.singleImageSize.y, 0, 0, this.singleImageSize.x, this.singleImageSize.y);
    };
    Spritesheet = __decorate([
        Parents(Renderable)
    ], Spritesheet);
    return Spritesheet;
}());
export default Spritesheet;
