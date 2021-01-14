import Vector from "./Vector.js";
export default class Player {
    constructor(roamState) {
        this.roamState = roamState;
        this.pos = new Vector(10, 5);
        this.drawSize = new Vector(1, 2);
        this.drawOffset = new Vector(0, -1);
        this.image = null;
        this.toUpdate = true;
        this.toRender = true;
        this.toPreload = true;
    }
    async preload(loader) {
        this.image = await loader.loadImage(`/assets/images/people/player.png`);
    }
    init() {
    }
    update(input) {
    }
    render(ctx) {
        if (!this.image)
            return;
        const pos = this.pos.sum(this.drawOffset).prod(this.roamState.tileSize);
        const size = this.drawSize.prod(this.roamState.tileSize);
        ctx.drawImage(this.image, 0, 0, 16, 32, pos.x, pos.y, size.x, size.y);
    }
}
