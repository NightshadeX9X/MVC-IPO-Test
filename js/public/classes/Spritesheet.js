import Vector from "./Vector.js";
export default class Spritesheet {
    constructor(image, size, player, spriteCount = new Vector(4)) {
        this.image = image;
        this.size = size;
        this.player = player;
        this.spriteCount = spriteCount;
        this.coords = new Vector();
    }
}
