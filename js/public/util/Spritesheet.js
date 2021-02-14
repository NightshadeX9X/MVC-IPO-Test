import Vector from "./Vector.js";
export default class Spritesheet {
    constructor(image, singleImageSizePx = new Vector(16, 32), imageCount = new Vector(4)) {
        this.image = image;
        this.singleImageSizePx = singleImageSizePx;
        this.imageCount = imageCount;
        this.pos = new Vector;
    }
    render(ctx) {
        const selectionStartPx = this.pos.prod(this.singleImageSizePx);
        ctx.drawImage(this.image, selectionStartPx.x, selectionStartPx.y, this.singleImageSizePx.x, this.singleImageSizePx.y, 0, 0, this.singleImageSizePx.x, this.singleImageSizePx.y);
    }
}
