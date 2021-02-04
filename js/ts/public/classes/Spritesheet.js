import Vector from "./Vector.js";
export default class Spritesheet {
    constructor(image, size, spriteCount = new Vector(4)) {
        this.image = image;
        this.size = size;
        this.spriteCount = spriteCount;
        this.coords = new Vector();
    }
    render(ctx, pos) {
        const coords = this.coords.prod(this.size);
        ctx.drawImage(this.image, coords.x, coords.y, this.size.x, this.size.y, pos.x, pos.y, this.size.x, this.size.y);
    }
}
