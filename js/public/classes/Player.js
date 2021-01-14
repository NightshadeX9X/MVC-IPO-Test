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
        let xp1 = [
            new Vector(1, 0)
        ];
        this.spritesheet.animator.register('down', new Vector(), xp1);
        this.spritesheet.animator.register('left', new Vector(0, 1), xp1);
        this.spritesheet.animator.register('right', new Vector(0, 2), xp1);
        this.spritesheet.animator.register('up', new Vector(0, 3), xp1);
    }
    update(input) {
        if (!this.spritesheet)
            return;
        const dirStrs = ["down", "left", "up", "right"];
        dirStrs.forEach(dirStr => {
            if (input.directionKeyStates[dirStr.toUpperCase()]) {
                this.spritesheet?.animator.play(dirStr.toLowerCase());
            }
            else {
                this.spritesheet?.animator.end(dirStr.toLowerCase());
            }
        });
    }
    render(ctx) {
        if (!this.image)
            return;
        const pos = this.pos.sum(this.drawOffset).prod(this.roamState.tileSize);
        this.spritesheet?.render(ctx, pos);
    }
}
