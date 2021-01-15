import Vector from "./Vector.js";
export default class Spritesheet {
    constructor(image, size, player, spriteCount = new Vector(4)) {
        this.image = image;
        this.size = size;
        this.player = player;
        this.spriteCount = spriteCount;
        this.coords = new Vector();
    }
    render(ctx, pos) {
        if (!this.image)
            return;
        const coords = this.coords.prod(this.player.roamState.tileSize).prod(this.size);
        const size = this.size.prod(this.player.roamState.tileSize);
        ctx.drawImage(this.image, coords.x, coords.y, size.x, size.y, pos.x, pos.y, size.x, size.y);
    }
}
