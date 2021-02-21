import { Preloadable, Renderable } from "../core/Attributes.js";
import BlankState from "../states/BlankState.js";
import DelayState from "../states/DelayState.js";
import Direction from "../util/Direction.js";
import { Mixin, New } from "../util/functions.js";
import Vector from "../util/Vector.js";
class Walker {
    constructor(...args) {
        this.pos = null;
        this.walkingToward = null;
        this.imageUrl = null;
        this.image = null;
        this.roamState = null;
        this.walking = null;
        this.direction = null;
        this.spriteCoords = null;
        return New(Walker, ...args);
    }
    static construct(roamState, pos, imageUrl) {
        Preloadable.construct.call(this);
        Renderable.construct.call(this);
        this.pos = pos;
        this.walkingToward = Vector.from(this.pos);
        this.imageUrl = imageUrl;
        this.roamState = roamState;
        this.walking = false;
        this.spriteCoords = new Vector();
        return this;
    }
    async preload(loader) {
        this.image = await loader.loadImage(`/assets/images/characters/${this.imageUrl}.png`);
    }
    render(ctx) {
        if (!this.image)
            return;
        ctx.drawImage(this.image, this.spriteCoords.x * this.roamState.tileSize, this.spriteCoords.y * this.roamState.tileSize * 2, this.roamState.tileSize, this.roamState.tileSize * 2, this.pos.x * this.roamState.tileSize, (this.pos.y - 1) * this.roamState.tileSize, this.roamState.tileSize, this.roamState.tileSize * 2);
    }
    async takeStep(dir, bgp) {
        const increment = () => {
            this.pos.add(Direction.toVector(dir).quo(16));
        };
        this.spriteCoords.x++;
        this.spriteCoords.x %= 4;
        for (let i = 0; i < 4; i++) {
            increment();
            const ds = new DelayState(bgp.subStateStack, 1);
            await bgp.subStateStack.push(ds);
            await ds.waitForRemoval();
        }
    }
    async walk(dir = this.direction) {
        if (this.walking)
            return;
        this.walking = true;
        this.setDirection(dir);
        this.walkingToward = this.pos.sum(Direction.toVector(dir));
        const originalPos = Vector.from(this.pos);
        const bgp = new BlankState(this.roamState.backgroundProcesses);
        await this.roamState.addBackgroundProcess(bgp);
        for (let i = 0; i < 4; i++) {
            await this.takeStep(dir, bgp);
        }
        this.evtHandler.dispatchEvent('walk', originalPos, this.walkingToward, this.direction);
        this.pos.set(this.walkingToward);
        this.walking = false;
        bgp.remove();
    }
    setDirection(direction) {
        this.direction = direction;
        if (direction === Direction.DOWN)
            this.spriteCoords.y = 0;
        if (direction === Direction.LEFT)
            this.spriteCoords.y = 1;
        if (direction === Direction.RIGHT)
            this.spriteCoords.y = 2;
        if (direction === Direction.UP)
            this.spriteCoords.y = 3;
    }
}
Mixin.apply(Walker, [Preloadable, Renderable]);
export default Walker;
