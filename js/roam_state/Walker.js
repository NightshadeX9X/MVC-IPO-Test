import { Preloadable, Renderable } from "../public/core/Attributes.js";
import { Mixin, New } from "../public/util/functions.js";
import Vector from "../public/util/Vector.js";
class Walker {
    constructor(...args) {
        this.pos = new Vector;
        this.imageUrl = "";
        this.image = new Image();
        this.roamState = null;
        return New(Walker, ...args);
    }
    static construct(roamState, pos, imageUrl) {
        Preloadable.construct.call(this);
        Renderable.construct.call(this);
        this.pos = pos;
        this.imageUrl = imageUrl;
        this.roamState = roamState;
        return this;
    }
    async preload(loader) {
        this.image = await loader.loadImage(`/assets/images/characters/${this.imageUrl}.png`);
    }
    render(ctx) {
        if (!this.image)
            return;
        ctx.drawImage(this.image, this.pos.x, this.pos.y, this.roamState.tileSize, this.roamState.tileSize);
    }
}
Mixin.apply(Walker, [Preloadable, Renderable]);
export default Walker;
