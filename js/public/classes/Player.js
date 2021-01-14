import Spritesheet from "./Spritesheet.js";
import Vector from "./Vector.js";
export default class Player {
    constructor(roamState) {
        this.roamState = roamState;
        this.pos = new Vector(10, 5);
        this.drawSize = new Vector(1, 2);
        this.drawOffset = new Vector(0, -1);
        this.image = null;
        this.spritesheet = null;
        this.toUpdate = true;
        this.toRender = true;
        this.toPreload = true;
    }
    async preload(loader) {
        this.image = await loader.loadImage(`/assets/images/people/player.png`);
        this.spritesheet = new Spritesheet(this.image, this.drawSize, this);
    }
    init() {
        if (!this.spritesheet)
            return;
        this.spritesheet.animator.register('down', new Vector(), [
            new Vector(0, 1)
        ]);
    }
    update(input) {
        if (this.spritesheet) {
            this.spritesheet.animator.play('down');
        }
    }
    render(ctx) {
        if (!this.image)
            return;
        const pos = this.pos.sum(this.drawOffset).prod(this.roamState.tileSize);
        this.spritesheet?.render(ctx, pos);
    }
}
